import type { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './env';

const successEnvelope = (dataSchema: object) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: dataSchema,
    message: { type: 'string' },
  },
});

const paginationSchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', example: 1 },
    limit: { type: 'integer', example: 12 },
    totalItems: { type: 'integer', example: 42 },
    totalPages: { type: 'integer', example: 4 },
    hasNextPage: { type: 'boolean', example: true },
    hasPreviousPage: { type: 'boolean', example: false },
  },
};

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

function jsonBody(schemaName: string) {
  return { required: true, content: { 'application/json': { schema: ref(schemaName) } } };
}

function okResponse(dataSchema: object, description = 'Successful response') {
  return {
    description,
    content: { 'application/json': { schema: successEnvelope(dataSchema) } },
  };
}

function errorResponse(description: string) {
  return { description, content: { 'application/json': { schema: ref('ErrorResponse') } } };
}

const commonErrors = {
  '400': errorResponse('Validation error'),
  '401': errorResponse('Unauthorized'),
  '404': errorResponse('Not found'),
  '500': errorResponse('Unexpected error'),
};

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Medical Tourism Armenia API',
    version: '1.0.0',
    description:
      'REST API for the Medical Tourism Armenia platform. Patients browse specialties and ' +
      'doctors and submit appointment requests; administrators manage content and requests.\n\n' +
      'This is an appointment *request* system: submissions are not confirmed automatically.',
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],
  tags: [
    { name: 'Health', description: 'Service health checks.' },
    { name: 'Specialties', description: 'Public medical specialty endpoints.' },
    { name: 'Medical Centers', description: 'Public medical center directory endpoints.' },
    { name: 'Packages', description: 'Public treatment & travel package endpoints.' },
    { name: 'Doctors', description: 'Public doctor directory endpoints.' },
    { name: 'Appointment Requests', description: 'Public appointment request submission and status lookup.' },
    { name: 'Contact Requests', description: 'Public contact form submissions.' },
    { name: 'Admin Authentication', description: 'Administrator login and profile.' },
    { name: 'Admin Specialties', description: 'Administrator specialty management.' },
    { name: 'Admin Medical Centers', description: 'Administrator medical center management.' },
    { name: 'Admin Packages', description: 'Administrator package management.' },
    { name: 'Admin Doctors', description: 'Administrator doctor management.' },
    { name: 'Admin Appointment Requests', description: 'Administrator appointment request management.' },
    { name: 'Admin Contact Requests', description: 'Administrator contact request management.' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'A valid email address is required' },
              },
            },
          },
        },
      },
      Specialty: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Plastic Surgery' },
          slug: { type: 'string', example: 'plastic-surgery' },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string' },
          treatments: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' },
          displayOrder: { type: 'integer' },
          doctorCount: { type: 'integer', example: 3 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SpecialtyInput: {
        type: 'object',
        required: ['name', 'shortDescription', 'description'],
        properties: {
          name: { type: 'string' },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string' },
          treatments: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean', default: true },
          displayOrder: { type: 'integer', default: 0 },
        },
      },
      MedicalCenter: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Erebuni Medical Center' },
          slug: { type: 'string', example: 'erebuni-medical-center' },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string', example: 'Yerevan' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          website: { type: 'string' },
          photoUrl: { type: 'string' },
          isActive: { type: 'boolean' },
          displayOrder: { type: 'integer' },
          doctorCount: { type: 'integer', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MedicalCenterRef: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          city: { type: 'string' },
          address: { type: 'string' },
        },
      },
      MedicalCenterInput: {
        type: 'object',
        required: ['name', 'shortDescription', 'description', 'address', 'city'],
        properties: {
          name: { type: 'string' },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          website: { type: 'string' },
          photoUrl: { type: 'string' },
          isActive: { type: 'boolean', default: true },
          displayOrder: { type: 'integer', default: 0 },
        },
      },
      PackageHotel: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Grand Hotel Yerevan' },
          stars: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
          roomType: { type: 'string', example: 'Deluxe double room' },
          nights: { type: 'integer', example: 9 },
          description: { type: 'string' },
        },
      },
      PackageTour: {
        type: 'object',
        properties: {
          title: { type: 'string', example: 'Yerevan city tour' },
          description: { type: 'string' },
        },
      },
      Package: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: '10-Day Dental & Discovery Package' },
          slug: { type: 'string', example: '10-day-dental-discovery-package' },
          durationDays: { type: 'integer', example: 10 },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          hotel: ref('PackageHotel'),
          tours: { type: 'array', items: ref('PackageTour') },
          inclusions: { type: 'array', items: { type: 'string' } },
          priceFrom: { type: 'number', example: 1200 },
          currency: { type: 'string', example: 'USD' },
          photoUrl: { type: 'string' },
          isActive: { type: 'boolean' },
          displayOrder: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PackageInput: {
        type: 'object',
        required: ['name', 'durationDays', 'shortDescription', 'description', 'hotel'],
        properties: {
          name: { type: 'string' },
          durationDays: { type: 'integer', minimum: 1, maximum: 90 },
          shortDescription: { type: 'string' },
          description: { type: 'string' },
          hotel: ref('PackageHotel'),
          tours: { type: 'array', items: ref('PackageTour') },
          inclusions: { type: 'array', items: { type: 'string' } },
          priceFrom: { type: 'number' },
          currency: { type: 'string', example: 'USD' },
          photoUrl: { type: 'string' },
          isActive: { type: 'boolean', default: true },
          displayOrder: { type: 'integer', default: 0 },
        },
      },
      Doctor: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          fullName: { type: 'string' },
          slug: { type: 'string' },
          specialty: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              slug: { type: 'string' },
            },
          },
          centers: { type: 'array', items: ref('MedicalCenterRef') },
          photoUrl: { type: 'string' },
          shortDescription: { type: 'string' },
          biography: { type: 'string' },
          education: { type: 'array', items: { type: 'string' } },
          certifications: { type: 'array', items: { type: 'string' } },
          treatments: { type: 'array', items: { type: 'string' } },
          languages: { type: 'array', items: { type: 'string' } },
          yearsOfExperience: { type: 'integer' },
          consultationPrice: { type: 'number' },
          consultationCurrency: { type: 'string' },
          isFeatured: { type: 'boolean' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      DoctorInput: {
        type: 'object',
        required: [
          'firstName',
          'lastName',
          'specialty',
          'centerIds',
          'shortDescription',
          'biography',
          'languages',
          'yearsOfExperience',
        ],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          specialty: { type: 'string', description: 'Specialty ObjectId' },
          centerIds: {
            type: 'array',
            items: { type: 'string' },
            description: 'One or more MedicalCenter ObjectIds.',
          },
          photoUrl: { type: 'string' },
          shortDescription: { type: 'string' },
          biography: { type: 'string' },
          education: { type: 'array', items: { type: 'string' } },
          certifications: { type: 'array', items: { type: 'string' } },
          treatments: { type: 'array', items: { type: 'string' } },
          languages: { type: 'array', items: { type: 'string' } },
          yearsOfExperience: { type: 'integer' },
          consultationPrice: { type: 'number' },
          consultationCurrency: { type: 'string', example: 'USD' },
          isFeatured: { type: 'boolean' },
          isActive: { type: 'boolean' },
        },
      },
      AppointmentRequestInput: {
        type: 'object',
        required: [
          'specialtyId',
          'preferredDate',
          'preferredTimePeriod',
          'firstName',
          'lastName',
          'email',
          'country',
          'preferredContactMethod',
          'contactValue',
          'consentAccepted',
        ],
        properties: {
          doctorId: { type: 'string', description: 'Optional doctor ObjectId' },
          specialtyId: { type: 'string', description: 'Specialty ObjectId' },
          preferredDate: {
            type: 'string',
            format: 'date',
            description:
              'Calendar date (YYYY-MM-DD). Must be between tomorrow and one month ahead, in Asia/Yerevan.',
            example: '2026-07-20',
          },
          preferredTimePeriod: {
            type: 'string',
            enum: ['morning', 'afternoon', 'evening', 'no_preference'],
          },
          firstName: { type: 'string', example: 'Maria' },
          lastName: { type: 'string', example: 'Ivanova' },
          email: { type: 'string', format: 'email', example: 'maria@example.com' },
          country: { type: 'string', example: 'Georgia' },
          phoneNumber: { type: 'string', example: '+995555123456' },
          preferredContactMethod: { type: 'string', enum: ['telegram', 'whatsapp'] },
          contactValue: {
            type: 'string',
            description: 'Telegram @username or WhatsApp phone number in international format.',
            example: '@maria_iv',
          },
          message: { type: 'string' },
          medicalInformation: { type: 'string' },
          consentAccepted: { type: 'boolean', example: true },
        },
      },
      AppointmentSubmissionResult: {
        type: 'object',
        properties: {
          referenceNumber: { type: 'string', example: 'ARM-2026-000123' },
          status: { type: 'string', example: 'new' },
          preferredDate: { type: 'string', format: 'date' },
          preferredTimePeriod: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AppointmentPublicStatus: {
        type: 'object',
        properties: {
          referenceNumber: { type: 'string', example: 'ARM-2026-000123' },
          status: { type: 'string', example: 'contacted' },
          doctorName: { type: 'string' },
          specialtyName: { type: 'string' },
          preferredDate: { type: 'string', format: 'date' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ContactRequestInput: {
        type: 'object',
        required: ['fullName', 'email', 'message'],
        properties: {
          fullName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          preferredContactMethod: { type: 'string', enum: ['telegram', 'whatsapp'] },
          contactValue: { type: 'string' },
          subject: { type: 'string' },
          message: { type: 'string' },
        },
      },
      AdminLoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@example.com' },
          password: { type: 'string', example: 'change-me-strong-password' },
        },
      },
    },
  },
  security: [],
  paths: buildPaths(),
};

function buildPaths(): Record<string, unknown> {
  return {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Service and database health',
        responses: { '200': okResponse({ type: 'object' }, 'Health status') },
      },
    },
    '/specialties': {
      get: {
        tags: ['Specialties'],
        summary: 'List active specialties',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Filter by name.' },
        ],
        responses: {
          '200': okResponse({ type: 'array', items: ref('Specialty') }, 'List of specialties'),
        },
      },
    },
    '/specialties/{slug}': {
      get: {
        tags: ['Specialties'],
        summary: 'Get a specialty by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('Specialty')), '404': commonErrors['404'] },
      },
    },
    '/centers': {
      get: {
        tags: ['Medical Centers'],
        summary: 'List active medical centers',
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by name or city.',
          },
        ],
        responses: {
          '200': okResponse(
            { type: 'array', items: ref('MedicalCenter') },
            'List of medical centers',
          ),
        },
      },
    },
    '/centers/{slug}': {
      get: {
        tags: ['Medical Centers'],
        summary: 'Get a medical center by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('MedicalCenter')), '404': commonErrors['404'] },
      },
    },
    '/packages': {
      get: {
        tags: ['Packages'],
        summary: 'List active packages',
        parameters: [
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by name or short description.',
          },
        ],
        responses: {
          '200': okResponse({ type: 'array', items: ref('Package') }, 'List of packages'),
        },
      },
    },
    '/packages/{slug}': {
      get: {
        tags: ['Packages'],
        summary: 'Get a package by slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('Package')), '404': commonErrors['404'] },
      },
    },
    '/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List doctors with filters and pagination',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'specialty', in: 'query', schema: { type: 'string' }, description: 'Slug or ObjectId.' },
          { name: 'language', in: 'query', schema: { type: 'string' } },
          { name: 'center', in: 'query', schema: { type: 'string' }, description: 'Center slug or ObjectId.' },
          { name: 'featured', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
          {
            name: 'sort',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['experience_desc', 'experience_asc', 'name_asc', 'name_desc'],
            },
          },
        ],
        responses: {
          '200': okResponse(
            {
              type: 'object',
              properties: {
                data: { type: 'array', items: ref('Doctor') },
                pagination: paginationSchema,
              },
            },
            'Paginated doctors',
          ),
        },
      },
    },
    '/doctors/featured': {
      get: {
        tags: ['Doctors'],
        summary: 'List featured doctors',
        responses: { '200': okResponse({ type: 'array', items: ref('Doctor') }) },
      },
    },
    '/doctors/{slug}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get a doctor by slug (with related doctors)',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': okResponse({
            type: 'object',
            properties: { doctor: ref('Doctor'), related: { type: 'array', items: ref('Doctor') } },
          }),
          '404': commonErrors['404'],
        },
      },
    },
    '/appointment-requests': {
      post: {
        tags: ['Appointment Requests'],
        summary: 'Submit an appointment request',
        description:
          'Creates a new appointment *request*. The preferred date must fall between tomorrow ' +
          'and one calendar month ahead (Asia/Yerevan). Returns a human-readable reference number.',
        requestBody: jsonBody('AppointmentRequestInput'),
        responses: {
          '201': okResponse(ref('AppointmentSubmissionResult'), 'Request created'),
          '400': commonErrors['400'],
          '429': errorResponse('Too many requests'),
        },
      },
    },
    '/appointment-requests/{referenceNumber}': {
      get: {
        tags: ['Appointment Requests'],
        summary: 'Public status lookup by reference number',
        description: 'Returns only privacy-safe fields — no contact or medical information.',
        parameters: [
          { name: 'referenceNumber', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': okResponse(ref('AppointmentPublicStatus')),
          '404': commonErrors['404'],
        },
      },
    },
    '/contact-requests': {
      post: {
        tags: ['Contact Requests'],
        summary: 'Submit a general contact request',
        requestBody: jsonBody('ContactRequestInput'),
        responses: { '201': okResponse({ type: 'object' }), '400': commonErrors['400'] },
      },
    },
    '/admin/auth/login': {
      post: {
        tags: ['Admin Authentication'],
        summary: 'Administrator login',
        requestBody: jsonBody('AdminLoginInput'),
        responses: {
          '200': okResponse({
            type: 'object',
            properties: { token: { type: 'string' }, user: { type: 'object' } },
          }),
          '401': commonErrors['401'],
        },
      },
    },
    '/admin/auth/me': {
      get: {
        tags: ['Admin Authentication'],
        summary: 'Current administrator profile',
        security: [{ bearerAuth: [] }],
        responses: { '200': okResponse({ type: 'object' }), '401': commonErrors['401'] },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Admin Authentication'],
        summary: 'Dashboard summary counts and upcoming appointments',
        security: [{ bearerAuth: [] }],
        responses: { '200': okResponse({ type: 'object' }), '401': commonErrors['401'] },
      },
    },
    '/admin/specialties': {
      get: {
        tags: ['Admin Specialties'],
        summary: 'List all specialties (including inactive)',
        security: [{ bearerAuth: [] }],
        responses: { '200': okResponse({ type: 'array', items: ref('Specialty') }), '401': commonErrors['401'] },
      },
      post: {
        tags: ['Admin Specialties'],
        summary: 'Create a specialty',
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody('SpecialtyInput'),
        responses: { '201': okResponse(ref('Specialty')), ...commonErrors },
      },
    },
    '/admin/specialties/{id}': {
      get: {
        tags: ['Admin Specialties'],
        summary: 'Get a specialty by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('Specialty')), ...commonErrors },
      },
      patch: {
        tags: ['Admin Specialties'],
        summary: 'Update a specialty',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody('SpecialtyInput'),
        responses: { '200': okResponse(ref('Specialty')), ...commonErrors },
      },
      delete: {
        tags: ['Admin Specialties'],
        summary: 'Delete a specialty',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
    '/admin/centers': {
      get: {
        tags: ['Admin Medical Centers'],
        summary: 'List all medical centers',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': okResponse({ type: 'array', items: ref('MedicalCenter') }),
          '401': commonErrors['401'],
        },
      },
      post: {
        tags: ['Admin Medical Centers'],
        summary: 'Create a medical center',
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody('MedicalCenterInput'),
        responses: { '201': okResponse(ref('MedicalCenter')), ...commonErrors },
      },
    },
    '/admin/centers/{id}': {
      get: {
        tags: ['Admin Medical Centers'],
        summary: 'Get a medical center by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('MedicalCenter')), ...commonErrors },
      },
      patch: {
        tags: ['Admin Medical Centers'],
        summary: 'Update a medical center',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody('MedicalCenterInput'),
        responses: { '200': okResponse(ref('MedicalCenter')), ...commonErrors },
      },
      delete: {
        tags: ['Admin Medical Centers'],
        summary: 'Delete a medical center',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
    '/admin/packages': {
      get: {
        tags: ['Admin Packages'],
        summary: 'List all packages',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': okResponse({ type: 'array', items: ref('Package') }),
          '401': commonErrors['401'],
        },
      },
      post: {
        tags: ['Admin Packages'],
        summary: 'Create a package',
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody('PackageInput'),
        responses: { '201': okResponse(ref('Package')), ...commonErrors },
      },
    },
    '/admin/packages/{id}': {
      get: {
        tags: ['Admin Packages'],
        summary: 'Get a package by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('Package')), ...commonErrors },
      },
      patch: {
        tags: ['Admin Packages'],
        summary: 'Update a package',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody('PackageInput'),
        responses: { '200': okResponse(ref('Package')), ...commonErrors },
      },
      delete: {
        tags: ['Admin Packages'],
        summary: 'Delete a package',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
    '/admin/doctors': {
      get: {
        tags: ['Admin Doctors'],
        summary: 'List all doctors (including inactive)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': okResponse({ type: 'object' }), '401': commonErrors['401'] },
      },
      post: {
        tags: ['Admin Doctors'],
        summary: 'Create a doctor',
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody('DoctorInput'),
        responses: { '201': okResponse(ref('Doctor')), ...commonErrors },
      },
    },
    '/admin/doctors/{id}': {
      get: {
        tags: ['Admin Doctors'],
        summary: 'Get a doctor by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse(ref('Doctor')), ...commonErrors },
      },
      patch: {
        tags: ['Admin Doctors'],
        summary: 'Update a doctor',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody('DoctorInput'),
        responses: { '200': okResponse(ref('Doctor')), ...commonErrors },
      },
      delete: {
        tags: ['Admin Doctors'],
        summary: 'Delete a doctor',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
    '/admin/appointment-requests': {
      get: {
        tags: ['Admin Appointment Requests'],
        summary: 'List appointment requests (full data)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'doctorId', in: 'query', schema: { type: 'string' } },
          { name: 'specialtyId', in: 'query', schema: { type: 'string' } },
          { name: 'email', in: 'query', schema: { type: 'string' } },
          { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'sort', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': okResponse({ type: 'object' }), '401': commonErrors['401'] },
      },
    },
    '/admin/appointment-requests/{id}': {
      get: {
        tags: ['Admin Appointment Requests'],
        summary: 'Get an appointment request by id',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
      patch: {
        tags: ['Admin Appointment Requests'],
        summary: 'Update status and/or internal notes',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
    '/admin/appointment-requests/{id}/status': {
      patch: {
        tags: ['Admin Appointment Requests'],
        summary: 'Change appointment status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
    '/admin/contact-requests': {
      get: {
        tags: ['Admin Contact Requests'],
        summary: 'List contact requests',
        security: [{ bearerAuth: [] }],
        responses: { '200': okResponse({ type: 'object' }), '401': commonErrors['401'] },
      },
    },
    '/admin/contact-requests/{id}/status': {
      patch: {
        tags: ['Admin Contact Requests'],
        summary: 'Update contact request status',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': okResponse({ type: 'object' }), ...commonErrors },
      },
    },
  };
}

export function setupSwagger(app: Express): void {
  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.json(openApiSpec);
  });
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customSiteTitle: 'Medical Tourism Armenia API Docs',
    }),
  );
  // eslint-disable-next-line no-console
  if (env.NODE_ENV !== 'test') console.log('Swagger UI available at /api/docs');
}
