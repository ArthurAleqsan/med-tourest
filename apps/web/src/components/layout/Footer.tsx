import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SiteLogo } from '@/components/layout/SiteLogo';
import { CONTACT, SITE_NAME } from '@/lib/config';
import { getTranslations } from '@/i18n/server';

export function Footer() {
  const { m, t } = getTranslations();

  const columns = [
    {
      title: m.footer.explore,
      links: [
        { href: '/doctors', label: m.footer.doctors },
        { href: '/centers', label: m.footer.centers },
        { href: '/packages', label: m.footer.packages },
        { href: '/#specialties', label: m.footer.specialties },
        { href: '/#how-it-works', label: m.footer.howItWorks },
        { href: '/#why-armenia', label: m.footer.whyArmenia },
      ],
    },
    {
      title: m.footer.support,
      links: [
        { href: '/contact', label: m.footer.contactUs },
        { href: '/appointments/request', label: m.footer.requestAppointment },
        { href: '/privacy-policy', label: m.footer.privacy },
        { href: '/terms-and-conditions', label: m.footer.terms },
      ],
    },
  ];

  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-100">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <SiteLogo variant="light" />
            <p className="mt-4 max-w-xs text-sm text-navy-100/70">{m.home.hero.title}</p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-100/70 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {m.footer.contact}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-navy-100/70">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                {m.footer.telegram}: {CONTACT.telegram}
              </li>
              <li>
                {m.footer.whatsapp}: {CONTACT.whatsapp}
              </li>
              <li className="pt-2">
                {CONTACT.officeLine1}
                <br />
                {CONTACT.officeLine2}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-navy-700/50 pt-6 text-center text-xs text-navy-100/60">
          <p>{t(m.footer.rights, { year: new Date().getFullYear(), site: SITE_NAME })}</p>
        </div>
      </Container>
    </footer>
  );
}
