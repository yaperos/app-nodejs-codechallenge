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

DROP DATABASE IF EXISTS transactions_yape;
--
-- TOC entry 3351 (class 1262 OID 16385)
-- Name: transactions_yape; Type: DATABASE; Schema: -; Owner: user
--

CREATE DATABASE transactions_yape WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE transactions_yape OWNER TO "user";

\connect transactions_yape

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
-- TOC entry 2 (class 3079 OID 16386)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3352 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16412)
-- Name: transaction; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.transaction (
    id integer NOT NULL,
    transaction_external_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    value bigint NOT NULL,
    account_external_id_debit character varying(20) NOT NULL,
    account_external_id_credit character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    "transactionStatusId" smallint NOT NULL,
    "transactionTypeId" smallint NOT NULL
);


ALTER TABLE public.transaction OWNER TO "user";

--
-- TOC entry 214 (class 1259 OID 16411)
-- Name: transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_id_seq OWNER TO "user";

--
-- TOC entry 3353 (class 0 OID 0)
-- Dependencies: 214
-- Name: transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.transaction_id_seq OWNED BY public.transaction.id;


--
-- TOC entry 211 (class 1259 OID 16398)
-- Name: transaction_status; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.transaction_status (
    id integer NOT NULL,
    name character varying(8) NOT NULL
);


ALTER TABLE public.transaction_status OWNER TO "user";

--
-- TOC entry 210 (class 1259 OID 16397)
-- Name: transaction_status_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.transaction_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_status_id_seq OWNER TO "user";

--
-- TOC entry 3354 (class 0 OID 0)
-- Dependencies: 210
-- Name: transaction_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.transaction_status_id_seq OWNED BY public.transaction_status.id;


--
-- TOC entry 213 (class 1259 OID 16405)
-- Name: transaction_type; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.transaction_type (
    id integer NOT NULL,
    name character varying(10) NOT NULL
);


ALTER TABLE public.transaction_type OWNER TO "user";

--
-- TOC entry 212 (class 1259 OID 16404)
-- Name: transaction_type_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.transaction_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_type_id_seq OWNER TO "user";

--
-- TOC entry 3355 (class 0 OID 0)
-- Dependencies: 212
-- Name: transaction_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.transaction_type_id_seq OWNED BY public.transaction_type.id;



ALTER TABLE ONLY public.transaction ALTER COLUMN id SET DEFAULT nextval('public.transaction_id_seq'::regclass);


ALTER TABLE ONLY public.transaction_status ALTER COLUMN id SET DEFAULT nextval('public.transaction_status_id_seq'::regclass);

ALTER TABLE ONLY public.transaction_type ALTER COLUMN id SET DEFAULT nextval('public.transaction_type_id_seq'::regclass);

INSERT INTO public.transaction_status (id, name) VALUES (1, 'pending');
INSERT INTO public.transaction_status (id, name) VALUES (2, 'approved');
INSERT INTO public.transaction_status (id, name) VALUES (3, 'rejected');


INSERT INTO public.transaction_type (id, name) VALUES (1, 'Type_01');
INSERT INTO public.transaction_type (id, name) VALUES (2, 'Type_02');


SELECT pg_catalog.setval('public.transaction_id_seq', 54, true);


SELECT pg_catalog.setval('public.transaction_status_id_seq', 1, false);


SELECT pg_catalog.setval('public.transaction_type_id_seq', 2, true);


ALTER TABLE ONLY public.transaction_status
    ADD CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY (id);


ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY (id);


ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY (id);


ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT "UQ_bd9118a135878b66c8e2546ab04" UNIQUE (transaction_external_id);

