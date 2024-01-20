--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-01-19 21:47:55 -05

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

DROP DATABASE IF EXISTS transactiondb;
--
-- TOC entry 3632 (class 1262 OID 17628)
-- Name: transactiondb; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE transactiondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';


ALTER DATABASE transactiondb OWNER TO postgres;

\connect transactiondb

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
-- TOC entry 2 (class 3079 OID 17646)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 17714)
-- Name: TransactionStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TransactionStatus" (
    "statusId" integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public."TransactionStatus" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17713)
-- Name: TransactionStatus_statusId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TransactionStatus_statusId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TransactionStatus_statusId_seq" OWNER TO postgres;

--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 217
-- Name: TransactionStatus_statusId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TransactionStatus_statusId_seq" OWNED BY public."TransactionStatus"."statusId";


--
-- TOC entry 220 (class 1259 OID 17723)
-- Name: TransferType; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TransferType" (
    "transferTypeId" integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public."TransferType" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 17722)
-- Name: TransferType_transferTypeId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TransferType_transferTypeId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TransferType_transferTypeId_seq" OWNER TO postgres;

--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 219
-- Name: TransferType_transferTypeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TransferType_transferTypeId_seq" OWNED BY public."TransferType"."transferTypeId";


--
-- TOC entry 216 (class 1259 OID 17657)
-- Name: transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction (
    "transactionExternalId" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "accountExternalIdDebit" character varying NOT NULL,
    "accountExternalIdCredit" character varying NOT NULL,
    "transferTypeId" integer NOT NULL,
    value numeric(10,2) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "statusId" integer
);


ALTER TABLE public.transaction OWNER TO postgres;

--
-- TOC entry 3465 (class 2604 OID 17717)
-- Name: TransactionStatus statusId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionStatus" ALTER COLUMN "statusId" SET DEFAULT nextval('public."TransactionStatus_statusId_seq"'::regclass);


--
-- TOC entry 3466 (class 2604 OID 17726)
-- Name: TransferType transferTypeId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransferType" ALTER COLUMN "transferTypeId" SET DEFAULT nextval('public."TransferType_transferTypeId_seq"'::regclass);


--
-- TOC entry 3624 (class 0 OID 17714)
-- Dependencies: 218
-- Data for Name: TransactionStatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."TransactionStatus" VALUES (1, 'pending');
INSERT INTO public."TransactionStatus" VALUES (2, 'approved');
INSERT INTO public."TransactionStatus" VALUES (3, 'rejected');


--
-- TOC entry 3626 (class 0 OID 17723)
-- Dependencies: 220
-- Data for Name: TransferType; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."TransferType" VALUES (1, 'Tipo1');
INSERT INTO public."TransferType" VALUES (2, 'Tipo2');
INSERT INTO public."TransferType" VALUES (3, 'Tipo3');


--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 217
-- Name: TransactionStatus_statusId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TransactionStatus_statusId_seq"', 3, true);


--
-- TOC entry 3637 (class 0 OID 0)
-- Dependencies: 219
-- Name: TransferType_transferTypeId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TransferType_transferTypeId_seq"', 3, true);


--
-- TOC entry 3468 (class 2606 OID 17666)
-- Name: transaction PK_e9d33ad38b57ee3c0b6af71e061; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "PK_e9d33ad38b57ee3c0b6af71e061" PRIMARY KEY ("transactionExternalId");


--
-- TOC entry 3470 (class 2606 OID 17719)
-- Name: TransactionStatus TransactionStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionStatus"
    ADD CONSTRAINT "TransactionStatus_pkey" PRIMARY KEY ("statusId");


--
-- TOC entry 3474 (class 2606 OID 17728)
-- Name: TransferType TransferType_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransferType"
    ADD CONSTRAINT "TransferType_pkey" PRIMARY KEY ("transferTypeId");


--
-- TOC entry 3472 (class 2606 OID 17721)
-- Name: TransactionStatus UQ_statusName; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionStatus"
    ADD CONSTRAINT "UQ_statusName" UNIQUE (name);


--
-- TOC entry 3476 (class 2606 OID 17730)
-- Name: TransferType UQ_transferTypeName; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransferType"
    ADD CONSTRAINT "UQ_transferTypeName" UNIQUE (name);


--
-- TOC entry 3477 (class 2606 OID 17731)
-- Name: transaction FK_transaction_statusId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_transaction_statusId" FOREIGN KEY ("statusId") REFERENCES public."TransactionStatus"("statusId");


--
-- TOC entry 3478 (class 2606 OID 17736)
-- Name: transaction FK_transaction_transferTypeId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "FK_transaction_transferTypeId" FOREIGN KEY ("transferTypeId") REFERENCES public."TransferType"("transferTypeId");


-- Completed on 2024-01-19 21:47:56 -05

--
-- PostgreSQL database dump complete
--

