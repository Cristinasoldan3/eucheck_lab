-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255),
    "is_company" BOOLEAN DEFAULT false,
    "company_name" VARCHAR(255),
    "vat_number" VARCHAR(50),
    "billing_address" TEXT,
    "country" VARCHAR(100),
    "tier" VARCHAR(50) DEFAULT 'STARTER',
    "tokens_balance" INTEGER NOT NULL DEFAULT 1,
    "can_export_pdf" BOOLEAN DEFAULT false,
    "has_unlimited_scans" BOOLEAN DEFAULT false,
    "has_lab_discounts" BOOLEAN DEFAULT false,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_activity_logs" (
    "id" SERIAL NOT NULL,
    "admin_account_id" INTEGER NOT NULL,
    "action_type" VARCHAR(100) NOT NULL,
    "target_table" VARCHAR(100) NOT NULL,
    "target_id" INTEGER,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_reports" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "dossier_id" INTEGER,
    "standard_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "score" INTEGER NOT NULL,
    "passed_rules" JSONB NOT NULL,
    "missing_rules" JSONB NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_rules" (
    "id" SERIAL NOT NULL,
    "standard_id" INTEGER NOT NULL,
    "clause_reference" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "keywords" TEXT[],
    "weight" INTEGER DEFAULT 1,
    "is_mandatory" BOOLEAN DEFAULT true,
    "recommendation" TEXT,

    CONSTRAINT "compliance_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dossier_components" (
    "id" SERIAL NOT NULL,
    "dossier_id" INTEGER NOT NULL,
    "component_name" VARCHAR(255) NOT NULL,
    "has_ce_mark" BOOLEAN DEFAULT false,
    "is_rohs_compliant" BOOLEAN DEFAULT false,

    CONSTRAINT "dossier_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "checkout_session_id" VARCHAR(255),
    "tier_bought" VARCHAR(50) NOT NULL,
    "tokens_added" INTEGER NOT NULL,
    "amount_paid_eur" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "invoice_name" VARCHAR(255),
    "invoice_vat_number" VARCHAR(50),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standards" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" INTEGER NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "official_url" VARCHAR(500),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans_config" (
    "id" SERIAL NOT NULL,
    "tier" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "price_eur" DECIMAL(10,2) NOT NULL,
    "tokens_included" INTEGER NOT NULL,
    "can_export_pdf" BOOLEAN DEFAULT false,
    "features_list" JSONB NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "subscription_plans_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technical_dossiers" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "internal_reference" VARCHAR(100),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technical_dossiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_feedbacks" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "standards_code_key" ON "standards"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_config_tier_key" ON "subscription_plans_config"("tier");

-- AddForeignKey
ALTER TABLE "admin_activity_logs" ADD CONSTRAINT "admin_activity_logs_admin_account_id_fkey" FOREIGN KEY ("admin_account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "technical_dossiers"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "standards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "compliance_rules" ADD CONSTRAINT "compliance_rules_standard_id_fkey" FOREIGN KEY ("standard_id") REFERENCES "standards"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dossier_components" ADD CONSTRAINT "dossier_components_dossier_id_fkey" FOREIGN KEY ("dossier_id") REFERENCES "technical_dossiers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "technical_dossiers" ADD CONSTRAINT "technical_dossiers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_feedbacks" ADD CONSTRAINT "audit_feedbacks_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
