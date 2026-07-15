CREATE TABLE "sxpaste_pastes" (
	"slug" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"edit_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
