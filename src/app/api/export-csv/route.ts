import { NextResponse } from 'next/server';
import { getPersonById } from '@/services/people';

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function createCsvRow(values: string[]) {
  return values.map(escapeCsvValue).join(',');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams
    .get('ids')
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!ids || ids.length === 0) {
    return NextResponse.json(
      { message: 'No selected items provided' },
      { status: 400 }
    );
  }

  const people = await Promise.all(ids.map((id) => getPersonById(id)));
  const validPeople = people.filter((person) => person !== null);

  const header = ['Name', 'Status', 'Species', 'Gender', 'Origin', 'Location'];

  const rows = validPeople.map((person) =>
    createCsvRow([
      person.name,
      person.status,
      person.species,
      person.gender,
      person.origin?.name ?? '',
      person.location?.name ?? '',
    ])
  );

  const csv = [createCsvRow(header), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${validPeople.length}_items.csv"`,
    },
  });
}
