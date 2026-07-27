import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import { getTranslations } from '@/i18n/server';

export function CtaBand() {
  const { m } = getTranslations();
  const cta = m.home.cta;

  return (
    <section className="bg-brand-700">
      <Container className="py-14">
        <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{cta.title}</h2>
            <p className="mt-2 max-w-2xl text-brand-100">{cta.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/appointments/request" variant="secondary" size="lg">
              {cta.requestAppointment}
            </LinkButton>
            <LinkButton
              href="/contact"
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              {cta.contactUs}
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
