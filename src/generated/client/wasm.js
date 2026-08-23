
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  phoneVerified: 'phoneVerified',
  passwordHash: 'passwordHash',
  role: 'role',
  hospitalId: 'hospitalId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OtpVerificationScalarFieldEnum = {
  id: 'id',
  phone: 'phone',
  code: 'code',
  expiresAt: 'expiresAt',
  verified: 'verified',
  createdAt: 'createdAt'
};

exports.Prisma.DivisionScalarFieldEnum = {
  id: 'id',
  nameEn: 'nameEn',
  nameBn: 'nameBn',
  slug: 'slug'
};

exports.Prisma.DistrictScalarFieldEnum = {
  id: 'id',
  divisionId: 'divisionId',
  nameEn: 'nameEn',
  nameBn: 'nameBn',
  slug: 'slug'
};

exports.Prisma.HospitalScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  districtId: 'districtId',
  hospitalType: 'hospitalType',
  status: 'status',
  isFeatured: 'isFeatured',
  address: 'address',
  phone: 'phone',
  emergencyPhone: 'emergencyPhone',
  email: 'email',
  website: 'website',
  googleMapUrl: 'googleMapUrl',
  establishedYear: 'establishedYear',
  description: 'description',
  latitude: 'latitude',
  longitude: 'longitude',
  logoUrl: 'logoUrl',
  coverUrl: 'coverUrl',
  licenseNumber: 'licenseNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DiagnosticTestScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  aliases: 'aliases',
  category: 'category',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.TestAvailabilityScalarFieldEnum = {
  id: 'id',
  testId: 'testId',
  hospitalId: 'hospitalId',
  availabilityStatus: 'availabilityStatus',
  price: 'price',
  notes: 'notes',
  lastVerifiedAt: 'lastVerifiedAt'
};

exports.Prisma.HospitalFacilityScalarFieldEnum = {
  id: 'id',
  hospitalId: 'hospitalId',
  facilityName: 'facilityName',
  isAvailable: 'isAvailable'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  hospitalId: 'hospitalId',
  nameEn: 'nameEn',
  nameBn: 'nameBn',
  description: 'description',
  icon: 'icon'
};

exports.Prisma.DoctorScalarFieldEnum = {
  id: 'id',
  hospitalId: 'hospitalId',
  departmentId: 'departmentId',
  name: 'name',
  slug: 'slug',
  degrees: 'degrees',
  specialization: 'specialization',
  bmdcNumber: 'bmdcNumber',
  experienceYears: 'experienceYears',
  bio: 'bio',
  treatedDiseases: 'treatedDiseases',
  languages: 'languages',
  consultationFee: 'consultationFee',
  chamberRoom: 'chamberRoom',
  chamberAddress: 'chamberAddress',
  phone: 'phone',
  photoUrl: 'photoUrl',
  posterUrl: 'posterUrl',
  lastSocialPostedAt: 'lastSocialPostedAt',
  isIndependent: 'isIndependent',
  email: 'email',
  passwordHash: 'passwordHash',
  walletBalance: 'walletBalance',
  activePackageName: 'activePackageName',
  packageExpiresAt: 'packageExpiresAt',
  remainingPosts: 'remainingPosts',
  remainingBoostDays: 'remainingBoostDays',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.WalletTransactionScalarFieldEnum = {
  id: 'id',
  doctorId: 'doctorId',
  amount: 'amount',
  type: 'type',
  method: 'method',
  trxId: 'trxId',
  senderPhone: 'senderPhone',
  notes: 'notes',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.DoctorCampaignScalarFieldEnum = {
  id: 'id',
  doctorId: 'doctorId',
  packageName: 'packageName',
  priceBdt: 'priceBdt',
  totalPosts: 'totalPosts',
  boostDays: 'boostDays',
  scheduledDate: 'scheduledDate',
  posterUrl: 'posterUrl',
  impressions: 'impressions',
  reach: 'reach',
  clicks: 'clicks',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.SocialPostLogScalarFieldEnum = {
  id: 'id',
  doctorId: 'doctorId',
  facebookPostId: 'facebookPostId',
  postedAt: 'postedAt',
  isDeleted: 'isDeleted',
  deletedAt: 'deletedAt'
};

exports.Prisma.DoctorScheduleScalarFieldEnum = {
  id: 'id',
  doctorId: 'doctorId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime',
  slotDurationMinutes: 'slotDurationMinutes',
  maxPatients: 'maxPatients'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  appointmentCode: 'appointmentCode',
  hospitalId: 'hospitalId',
  doctorId: 'doctorId',
  patientName: 'patientName',
  patientPhone: 'patientPhone',
  patientAge: 'patientAge',
  patientGender: 'patientGender',
  patientEmail: 'patientEmail',
  visitReason: 'visitReason',
  appointmentDate: 'appointmentDate',
  timeSlot: 'timeSlot',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.SubscriptionPlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  priceBdt: 'priceBdt',
  maxDoctors: 'maxDoctors',
  featuresJson: 'featuresJson'
};

exports.Prisma.HospitalSubscriptionScalarFieldEnum = {
  id: 'id',
  hospitalId: 'hospitalId',
  planId: 'planId',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  hospitalId: 'hospitalId',
  doctorId: 'doctorId',
  patientName: 'patientName',
  rating: 'rating',
  comment: 'comment',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  hospitalId: 'hospitalId',
  action: 'action',
  details: 'details',
  createdAt: 'createdAt'
};

exports.Prisma.EmergencyHelplineScalarFieldEnum = {
  id: 'id',
  title: 'title',
  number: 'number',
  desc: 'desc',
  badge: 'badge',
  icon: 'icon',
  isAvailable: 'isAvailable',
  orderIndex: 'orderIndex',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BloodDonorScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  phone: 'phone',
  bloodGroup: 'bloodGroup',
  age: 'age',
  gender: 'gender',
  address: 'address',
  area: 'area',
  availability: 'availability',
  lastDonationDate: 'lastDonationDate',
  note: 'note',
  consent: 'consent',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  approvedAt: 'approvedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  OtpVerification: 'OtpVerification',
  Division: 'Division',
  District: 'District',
  Hospital: 'Hospital',
  DiagnosticTest: 'DiagnosticTest',
  TestAvailability: 'TestAvailability',
  HospitalFacility: 'HospitalFacility',
  Department: 'Department',
  Doctor: 'Doctor',
  WalletTransaction: 'WalletTransaction',
  DoctorCampaign: 'DoctorCampaign',
  SocialPostLog: 'SocialPostLog',
  DoctorSchedule: 'DoctorSchedule',
  Appointment: 'Appointment',
  SubscriptionPlan: 'SubscriptionPlan',
  HospitalSubscription: 'HospitalSubscription',
  Review: 'Review',
  AuditLog: 'AuditLog',
  EmergencyHelpline: 'EmergencyHelpline',
  BloodDonor: 'BloodDonor'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
