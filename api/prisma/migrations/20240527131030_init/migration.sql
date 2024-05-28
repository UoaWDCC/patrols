-- CreateEnum
CREATE TYPE "Call Sign" AS ENUM ('MRCS', 'MACS');

-- CreateEnum
CREATE TYPE "PoliceStation" AS ENUM ('Mt Roskill Police Station', 'Mt Albert Police Station');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('Mt Albert', 'Mt Roskill', 'Epsom', 'Howick');

-- CreateEnum
CREATE TYPE "LogonStatus" AS ENUM ('No', 'Pending', 'Yes');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('Wet', 'Dry');

-- CreateTable
CREATE TABLE "Shift" (
    "id" BIGSERIAL NOT NULL,
    "event_no" INTEGER,
    "patrol_id" BIGINT NOT NULL,
    "start_time" TIMESTAMPTZ(0) NOT NULL,
    "end_time" TIMESTAMPTZ(0) NOT NULL,
    "police_station_base" TEXT NOT NULL,
    "observer_id" BIGINT NOT NULL,
    "driver_id" BIGINT NOT NULL,
    "vehicle_id" BIGINT NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestPatrollers" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isRegistered" BOOLEAN NOT NULL,
    "member_id" BIGINT,
    "shift_id" BIGINT NOT NULL,

    CONSTRAINT "GuestPatrollers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" BIGSERIAL NOT NULL,
    "patrol_id" BIGINT NOT NULL,
    "registration_no" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "hasLiveryOrSignage" BOOLEAN NOT NULL,
    "hasPoliceRadio" BOOLEAN NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentChecklist" (
    "id" BIGSERIAL NOT NULL,
    "hi_viz_uniform" BOOLEAN NOT NULL,
    "first_aid_kit" BOOLEAN NOT NULL,
    "torch_or_wand" BOOLEAN NOT NULL,
    "fireExtinguisher" BOOLEAN NOT NULL,
    "roadCones" BOOLEAN NOT NULL,
    "addtionalItems" TEXT[],
    "note" TEXT,

    CONSTRAINT "EquipmentChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleCheckList" (
    "id" BIGSERIAL NOT NULL,
    "externalLighting" BOOLEAN NOT NULL,
    "lightAndAlley" BOOLEAN NOT NULL,
    "DashCamOperation" BOOLEAN NOT NULL,
    "note" TEXT,

    CONSTRAINT "VehicleCheckList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleDetails" (
    "id" BIGSERIAL NOT NULL,
    "vehicle_id" BIGINT NOT NULL,
    "hasWof" BOOLEAN NOT NULL,
    "hasRegistration" BOOLEAN NOT NULL,
    "isSafe" BOOLEAN NOT NULL,
    "hasVisibleDamage" BOOLEAN NOT NULL,
    "visible_damage_note" TEXT,
    "vehicle_checkList_id" BIGINT NOT NULL,
    "equipment_checklist_id" BIGINT NOT NULL,
    "isVehicleManagerAttentionNeeded" BOOLEAN NOT NULL,

    CONSTRAINT "VehicleDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observations" (
    "id" BIGSERIAL NOT NULL,
    "start_time" TIMESTAMPTZ(0) NOT NULL,
    "end_time" TIMESTAMPTZ(0) NOT NULL,
    "location" TEXT NOT NULL,
    "isPoliceOrSecurityPresent" BOOLEAN NOT NULL,
    "incidentCategory" TEXT NOT NULL,
    "incidentSubCategory" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "report_id" BIGINT NOT NULL,

    CONSTRAINT "Observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentTypes" (
    "incidentCategory" TEXT NOT NULL,
    "incidentSubCategory" TEXT NOT NULL,

    CONSTRAINT "IncidentTypes_pkey" PRIMARY KEY ("incidentCategory","incidentSubCategory")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" BIGSERIAL NOT NULL,
    "member_id" BIGINT NOT NULL,
    "shift_id" BIGINT NOT NULL,
    "vehicle_details_id" BIGINT NOT NULL,
    "odometer_initial_reading" INTEGER NOT NULL,
    "odometer_final_reading" INTEGER NOT NULL,
    "weather_condition" "Weather" NOT NULL,
    "isFootPatrol" BOOLEAN NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_stats_dev" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "district_id" BIGINT NOT NULL,
    "year" BIGINT NOT NULL,
    "month" BIGINT NOT NULL,
    "vehicle_related" SMALLINT,
    "property_related" SMALLINT,
    "damaged_property" SMALLINT,
    "disorder_related" SMALLINT,
    "people_related" SMALLINT,
    "special_service" SMALLINT,
    "kms_travelled" DOUBLE PRECISION,
    "patrol_hours" DOUBLE PRECISION,
    "camera_hours" DOUBLE PRECISION,
    "training" DOUBLE PRECISION,
    "administration" DOUBLE PRECISION,
    "submitter_cpnz_id" BIGINT NOT NULL,

    CONSTRAINT "district_stats_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district_stats_prod" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "district_id" BIGINT NOT NULL,
    "year" BIGINT NOT NULL,
    "month" BIGINT NOT NULL,
    "vehicle_related" SMALLINT,
    "property_related" SMALLINT,
    "damaged_property" SMALLINT,
    "disorder_related" SMALLINT,
    "people_related" SMALLINT,
    "special_service" SMALLINT,
    "kms_travelled" DOUBLE PRECISION,
    "patrol_hours" DOUBLE PRECISION,
    "camera_hours" DOUBLE PRECISION,
    "training" DOUBLE PRECISION,
    "administration" DOUBLE PRECISION,
    "submitter_cpnz_id" BIGINT NOT NULL,

    CONSTRAINT "district_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts_dev" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "name" "Region" NOT NULL DEFAULT 'Mt Roskill',
    "email" TEXT NOT NULL DEFAULT 'office@cpnz.org.nz',

    CONSTRAINT "districts_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts_prod" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT 'office@cpnz.org.nz',

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imports_dev" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "short_patrol_name" TEXT NOT NULL,
    "live_entries" TEXT NOT NULL,
    "list_but_no_card" TEXT NOT NULL,
    "cpnz_id" TEXT NOT NULL,
    "entry_date" TEXT NOT NULL,
    "current_card_count" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "first_names" TEXT NOT NULL,
    "known_as" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "driver_licence" TEXT NOT NULL,
    "vetting_date" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "home" TEXT NOT NULL,
    "cellular" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "patroller" TEXT NOT NULL,
    "coordinator" TEXT NOT NULL,
    "secretary" TEXT NOT NULL,
    "training_officer" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "skills2" TEXT NOT NULL,
    "skills3" TEXT NOT NULL,
    "skills4" TEXT NOT NULL,
    "skills5" TEXT NOT NULL,
    "skills6" TEXT NOT NULL,
    "patrol_name" TEXT NOT NULL,
    "district" TEXT NOT NULL,

    CONSTRAINT "imports_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imports_prod" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "short_patrol_name" TEXT NOT NULL,
    "live_entries" TEXT NOT NULL,
    "list_but_no_card" TEXT NOT NULL,
    "cpnz_id" TEXT NOT NULL,
    "entry_date" TEXT NOT NULL,
    "current_card_count" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "first_names" TEXT NOT NULL,
    "known_as" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "driver_licence" TEXT NOT NULL,
    "vetting_date" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "home" TEXT NOT NULL,
    "cellular" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "patroller" TEXT NOT NULL,
    "coordinator" TEXT NOT NULL,
    "secretary" TEXT NOT NULL,
    "training_officer" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "skills2" TEXT NOT NULL,
    "skills3" TEXT NOT NULL,
    "skills4" TEXT NOT NULL,
    "skills5" TEXT NOT NULL,
    "skills6" TEXT NOT NULL,
    "patrol_name" TEXT NOT NULL,
    "district" TEXT NOT NULL,

    CONSTRAINT "imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members_dev" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "active_member" SMALLINT NOT NULL,
    "patrol_id" BIGINT NOT NULL,
    "district_id" BIGINT NOT NULL,
    "cpnz_id" BIGINT NOT NULL,
    "surname" TEXT NOT NULL,
    "first_names" TEXT NOT NULL,
    "known_as" TEXT,
    "date_of_birth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "driver_licence_number" TEXT NOT NULL,
    "vetting_date" TEXT,
    "business_phone" TEXT,
    "home_phone" TEXT,
    "mobile_phone" TEXT,
    "address_line_1" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "patroller" SMALLINT NOT NULL,
    "officer" SMALLINT NOT NULL,
    "officer_type" TEXT NOT NULL,
    "languages" TEXT,
    "skills" TEXT,
    "notes" TEXT,
    "photo_id" TEXT NOT NULL,
    "constabulary" SMALLINT NOT NULL DEFAULT 1,
    "qi" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "officer_patroller" SMALLINT,
    "officer_patrol_leader_1" SMALLINT,
    "officer_patrol_leader_2" SMALLINT,
    "officer_secretary" SMALLINT,
    "officer_patrol_trainer" SMALLINT,
    "officer_avp1" SMALLINT,
    "officer_avp2" SMALLINT,
    "officer_health_and_safety" SMALLINT,
    "officer_patrol_member_other" SMALLINT,
    "officer_district_leader" SMALLINT,
    "officer_district_trainer" SMALLINT,
    "officer_district_support_officer" SMALLINT,
    "officer_district_other" SMALLINT,
    "officer_cpnz_staff" SMALLINT,
    "officer_probationer" SMALLINT,
    "access_website" SMALLINT,
    "trained" SMALLINT NOT NULL DEFAULT 0,
    "new_nationality" TEXT NOT NULL DEFAULT 'Not known',
    "treasurer" SMALLINT,
    "call_sign" "Call Sign" NOT NULL DEFAULT 'MRCS',
    "police_station" "PoliceStation" NOT NULL DEFAULT 'Mt Roskill Police Station',
    "password" TEXT NOT NULL,
    "logon_status" "LogonStatus" NOT NULL DEFAULT 'No',

    CONSTRAINT "members_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members_prod" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "active_member" SMALLINT NOT NULL,
    "patrol_id" BIGINT NOT NULL,
    "district_id" BIGINT NOT NULL,
    "cpnz_id" BIGINT NOT NULL,
    "surname" TEXT NOT NULL,
    "first_names" TEXT NOT NULL,
    "known_as" TEXT,
    "date_of_birth" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "driver_licence_number" TEXT NOT NULL,
    "vetting_date" TEXT,
    "business_phone" TEXT,
    "home_phone" TEXT,
    "mobile_phone" TEXT,
    "address_line_1" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "post_code" TEXT NOT NULL,
    "email" TEXT,
    "patroller" SMALLINT NOT NULL,
    "officer" SMALLINT NOT NULL,
    "officer_type" TEXT NOT NULL,
    "languages" TEXT,
    "skills" TEXT,
    "notes" TEXT,
    "photo_id" TEXT NOT NULL,
    "constabulary" SMALLINT NOT NULL DEFAULT 1,
    "qi" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "officer_patroller" SMALLINT,
    "officer_patrol_leader_1" SMALLINT,
    "officer_patrol_leader_2" SMALLINT,
    "officer_secretary" SMALLINT,
    "officer_patrol_trainer" SMALLINT,
    "officer_avp1" SMALLINT,
    "officer_avp2" SMALLINT,
    "officer_health_and_safety" SMALLINT,
    "officer_patrol_member_other" SMALLINT,
    "officer_district_leader" SMALLINT,
    "officer_district_trainer" SMALLINT,
    "officer_district_support_officer" SMALLINT,
    "officer_district_other" SMALLINT,
    "officer_cpnz_staff" SMALLINT,
    "officer_probationer" SMALLINT,
    "access_website" SMALLINT,
    "trained" SMALLINT NOT NULL DEFAULT 0,
    "new_nationality" TEXT NOT NULL DEFAULT 'Not known',
    "treasurer" SMALLINT,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrols_dev" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "active" SMALLINT NOT NULL,
    "district_id" BIGINT NOT NULL,
    "notes" TEXT,
    "call_sign" TEXT,
    "year_joined" TEXT,
    "email" TEXT NOT NULL DEFAULT 'office@cpnz.org.nz',

    CONSTRAINT "patrols_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrols_prod" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "active" SMALLINT NOT NULL,
    "district_id" BIGINT NOT NULL,
    "notes" TEXT,
    "call_sign" TEXT,
    "year_joined" TEXT,
    "email" TEXT NOT NULL DEFAULT 'office@cpnz.org.nz',

    CONSTRAINT "patrols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats_dev" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "patrol_id" BIGINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "month" SMALLINT NOT NULL,
    "vehicle_related" SMALLINT,
    "property_related" SMALLINT,
    "damaged_property" SMALLINT,
    "disorder_related" SMALLINT,
    "people_related" SMALLINT,
    "special_service" SMALLINT,
    "kms_travelled" DOUBLE PRECISION,
    "patrol_hours" DOUBLE PRECISION,
    "camera_hours" DOUBLE PRECISION,
    "training" DOUBLE PRECISION,
    "administration" DOUBLE PRECISION,
    "submitter_cpnz_id" BIGINT NOT NULL,

    CONSTRAINT "stats_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stats_prod" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "patrol_id" BIGINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "month" SMALLINT NOT NULL,
    "vehicle_related" SMALLINT,
    "property_related" SMALLINT,
    "damaged_property" SMALLINT,
    "disorder_related" SMALLINT,
    "people_related" SMALLINT,
    "special_service" SMALLINT,
    "kms_travelled" DOUBLE PRECISION,
    "patrol_hours" DOUBLE PRECISION,
    "camera_hours" DOUBLE PRECISION,
    "training" DOUBLE PRECISION,
    "administration" DOUBLE PRECISION,
    "submitter_cpnz_id" BIGINT NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_dev" (
    "id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "access_level" TEXT NOT NULL,
    "member_id" BIGINT NOT NULL,
    "remember_token" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "district" BIGINT,
    "patrol" BIGINT,

    CONSTRAINT "users_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_prod" (
    "id" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "access_level" TEXT NOT NULL,
    "member_id" BIGINT NOT NULL,
    "remember_token" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "district" BIGINT,
    "patrol" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_dev" (
    "name" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "model" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "colour" TEXT,
    "livery" BOOLEAN,
    "patrolID" BIGINT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "id" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "vehicle_dev_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "vehicle_make" (
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Vehicle_Make_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "vehicles_model" (
    "name" TEXT NOT NULL,
    "model_name" TEXT,

    CONSTRAINT "Vehicles_Model_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shift_id_key" ON "Shift"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GuestPatrollers_id_key" ON "GuestPatrollers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_id_key" ON "Vehicle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registration_no_key" ON "Vehicle"("registration_no");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentChecklist_id_key" ON "EquipmentChecklist"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleCheckList_id_key" ON "VehicleCheckList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDetails_id_key" ON "VehicleDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDetails_vehicle_checkList_id_key" ON "VehicleDetails"("vehicle_checkList_id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleDetails_equipment_checklist_id_key" ON "VehicleDetails"("equipment_checklist_id");

-- CreateIndex
CREATE UNIQUE INDEX "Observations_id_key" ON "Observations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE UNIQUE INDEX "districts_dev_name_key" ON "districts_dev"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_key" ON "districts_prod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "members_dev_email_key" ON "members_dev"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patrols_dev_id_key" ON "patrols_dev"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_dev_email_key" ON "users_dev"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users_prod"("email");

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_patrol_id_fkey" FOREIGN KEY ("patrol_id") REFERENCES "patrols_dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_observer_id_fkey" FOREIGN KEY ("observer_id") REFERENCES "members_dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "members_dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPatrollers" ADD CONSTRAINT "GuestPatrollers_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_patrol_id_fkey" FOREIGN KEY ("patrol_id") REFERENCES "patrols_dev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDetails" ADD CONSTRAINT "VehicleDetails_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDetails" ADD CONSTRAINT "VehicleDetails_vehicle_checkList_id_fkey" FOREIGN KEY ("vehicle_checkList_id") REFERENCES "VehicleCheckList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDetails" ADD CONSTRAINT "VehicleDetails_equipment_checklist_id_fkey" FOREIGN KEY ("equipment_checklist_id") REFERENCES "EquipmentChecklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observations" ADD CONSTRAINT "Observations_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members_dev" ADD CONSTRAINT "members_dev_patrol_id_fkey" FOREIGN KEY ("patrol_id") REFERENCES "patrols_prod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members_prod" ADD CONSTRAINT "members_patrol_id_fkey" FOREIGN KEY ("patrol_id") REFERENCES "patrols_prod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrols_dev" ADD CONSTRAINT "patrols_dev_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts_prod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrols_prod" ADD CONSTRAINT "patrols_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts_prod"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_dev" ADD CONSTRAINT "vehicle_dev_model_fkey" FOREIGN KEY ("model") REFERENCES "vehicles_model"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicle_dev" ADD CONSTRAINT "vehicle_dev_patrolID_fkey" FOREIGN KEY ("patrolID") REFERENCES "patrols_dev"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "vehicles_model" ADD CONSTRAINT "Vehicles_Model_model_name_fkey" FOREIGN KEY ("model_name") REFERENCES "vehicle_make"("name") ON DELETE NO ACTION ON UPDATE NO ACTION;
