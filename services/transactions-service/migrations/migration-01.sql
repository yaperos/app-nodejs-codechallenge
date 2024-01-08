--
-- PostgreSQL database dump
--

-- Dumped from database version 14.10 (Debian 14.10-1.pgdg120+1)
-- Dumped by pg_dump version 14.10 (Debian 14.10-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: transactions_status_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.transactions_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.transactions_status_enum OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    transaction_eternal_id uuid NOT NULL,
    account_external_id_debit character varying NOT NULL,
    account_external_id_credit character varying NOT NULL,
    value double precision NOT NULL,
    status public.transactions_status_enum DEFAULT 'pending'::public.transactions_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "transactionTypeId" integer
);


ALTER TABLE public.transactions OWNER TO admin;

--
-- Name: transactions_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.transactions_types (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.transactions_types OWNER TO admin;

--
-- Name: transactions_types_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.transactions_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_types_id_seq OWNER TO admin;

--
-- Name: transactions_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.transactions_types_id_seq OWNED BY public.transactions_types.id;


--
-- Name: transactions_types id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions_types ALTER COLUMN id SET DEFAULT nextval('public.transactions_types_id_seq'::regclass);


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.transactions (id, transaction_eternal_id, account_external_id_debit, account_external_id_credit, value, status, created_at, updated_at, "transactionTypeId") FROM stdin;
\.


--
-- Data for Name: transactions_types; Type: TABLE DATA; Schema: public; Owner: admin
--

-- COPY public.transactions_types (id, name, created_at, updated_at) FROM stdin;
-- 1       type 1  2024-01-07 12:50:30.923852      2024-01-07 12:50:30.923852
-- 2       type 2  2024-01-07 12:50:34.320474      2024-01-07 12:50:34.320474
-- 3       type 3  2024-01-07 12:50:37.880134      2024-01-07 12:50:37.880134
-- 4       type 4  2024-01-07 12:50:41.206175      2024-01-07 12:50:41.206175
-- \.

--
-- Name: transactions_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

-- SELECT pg_catalog.setval('public.transactions_types_id_seq', 4, true);


--
-- Name: transactions PK_a219afd8dd77ed80f5a862f1db9; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY (id);


--
-- Name: transactions_types PK_bc71ae41a9b85acf0a654b068b2; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions_types
    ADD CONSTRAINT "PK_bc71ae41a9b85acf0a654b068b2" PRIMARY KEY (id);


--
-- Name: transactions FK_13ec2f6f02ddbb52a02ab867156; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "FK_13ec2f6f02ddbb52a02ab867156" FOREIGN KEY ("transactionTypeId") REFERENCES public.transactions_types(id);


INSERT INTO public.transactions_types
("name")
VALUES('type 1');

INSERT INTO public.transactions_types
("name")
VALUES('type 2');

INSERT INTO public.transactions_types
("name")
VALUES('type 3');

INSERT INTO public.transactions_types
("name")
VALUES('type 4');

--
-- PostgreSQL database dump complete
--