'use server';

import { redirect } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { QueryParam } from '@/constants/app';
import { routing } from '@/i18n/routing';

export async function searchPeopleAction(formData: FormData) {
  const rawLocale = String(formData.get('locale') ?? routing.defaultLocale);
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale;

  const searchTerm = String(formData.get(QueryParam.name) ?? '').trim();

  const params = new URLSearchParams();
  params.set(QueryParam.page, '1');

  if (searchTerm) {
    params.set(QueryParam.name, searchTerm);
  }

  redirect(`/${locale}?${params.toString()}`);
}
