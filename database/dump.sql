PGDMP  ,                    |            app-nodejs-codechallenge     14.10 (Debian 14.10-1.pgdg120+1)    16.0                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                        0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            !           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            "           1262    16384    app-nodejs-codechallenge    DATABASE     �   CREATE DATABASE "app-nodejs-codechallenge" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
 *   DROP DATABASE "app-nodejs-codechallenge";
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            #           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    4            �            1255    16416    update_transaction_updated_at()    FUNCTION     �   CREATE FUNCTION public.update_transaction_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;
 6   DROP FUNCTION public.update_transaction_updated_at();
       public          postgres    false    4            �            1259    16399    transaction    TABLE     s  CREATE TABLE public.transaction (
    transactionexternalid uuid NOT NULL,
    accountexternaliddebit uuid,
    accountexternalidcredit uuid,
    transactiontypeid integer,
    value numeric(18,2),
    transactionstatusid integer,
    createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.transaction;
       public         heap    postgres    false    4            �            1259    16393    transaction_status    TABLE     e   CREATE TABLE public.transaction_status (
    id integer NOT NULL,
    name character varying(200)
);
 &   DROP TABLE public.transaction_status;
       public         heap    postgres    false    4            �            1259    16386    transaction_type    TABLE     c   CREATE TABLE public.transaction_type (
    id integer NOT NULL,
    name character varying(200)
);
 $   DROP TABLE public.transaction_type;
       public         heap    postgres    false    4            �            1259    16392    transactionstatus_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactionstatus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.transactionstatus_id_seq;
       public          postgres    false    4    212            $           0    0    transactionstatus_id_seq    SEQUENCE OWNED BY     V   ALTER SEQUENCE public.transactionstatus_id_seq OWNED BY public.transaction_status.id;
          public          postgres    false    211            �            1259    16385    transactiontype_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transactiontype_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.transactiontype_id_seq;
       public          postgres    false    210    4            %           0    0    transactiontype_id_seq    SEQUENCE OWNED BY     R   ALTER SEQUENCE public.transactiontype_id_seq OWNED BY public.transaction_type.id;
          public          postgres    false    209            �           2604    16396    transaction_status id    DEFAULT     }   ALTER TABLE ONLY public.transaction_status ALTER COLUMN id SET DEFAULT nextval('public.transactionstatus_id_seq'::regclass);
 D   ALTER TABLE public.transaction_status ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    211    212    212            �           2604    16389    transaction_type id    DEFAULT     y   ALTER TABLE ONLY public.transaction_type ALTER COLUMN id SET DEFAULT nextval('public.transactiontype_id_seq'::regclass);
 B   ALTER TABLE public.transaction_type ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210                      0    16399    transaction 
   TABLE DATA           �   COPY public.transaction (transactionexternalid, accountexternaliddebit, accountexternalidcredit, transactiontypeid, value, transactionstatusid, createdat, updatedat) FROM stdin;
    public          postgres    false    213   x                  0    16393    transaction_status 
   TABLE DATA           6   COPY public.transaction_status (id, name) FROM stdin;
    public          postgres    false    212   �                  0    16386    transaction_type 
   TABLE DATA           4   COPY public.transaction_type (id, name) FROM stdin;
    public          postgres    false    210   �        &           0    0    transactionstatus_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.transactionstatus_id_seq', 1, false);
          public          postgres    false    211            '           0    0    transactiontype_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.transactiontype_id_seq', 1, false);
          public          postgres    false    209            �           2606    16405    transaction transaction_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_pkey PRIMARY KEY (transactionexternalid);
 F   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_pkey;
       public            postgres    false    213            �           2606    16398 )   transaction_status transactionstatus_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.transaction_status
    ADD CONSTRAINT transactionstatus_pkey PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.transaction_status DROP CONSTRAINT transactionstatus_pkey;
       public            postgres    false    212            �           2606    16391 %   transaction_type transactiontype_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.transaction_type
    ADD CONSTRAINT transactiontype_pkey PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.transaction_type DROP CONSTRAINT transactiontype_pkey;
       public            postgres    false    210            �           2620    16417 1   transaction trigger_update_transaction_updated_at    TRIGGER     �   CREATE TRIGGER trigger_update_transaction_updated_at BEFORE UPDATE ON public.transaction FOR EACH ROW EXECUTE FUNCTION public.update_transaction_updated_at();
 J   DROP TRIGGER trigger_update_transaction_updated_at ON public.transaction;
       public          postgres    false    213    214            �           2606    16411 0   transaction transaction_transactionstatusid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_transactionstatusid_fkey FOREIGN KEY (transactionstatusid) REFERENCES public.transaction_status(id);
 Z   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_transactionstatusid_fkey;
       public          postgres    false    213    212    3207            �           2606    16406 .   transaction transaction_transactiontypeid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction
    ADD CONSTRAINT transaction_transactiontypeid_fkey FOREIGN KEY (transactiontypeid) REFERENCES public.transaction_type(id);
 X   ALTER TABLE ONLY public.transaction DROP CONSTRAINT transaction_transactiontypeid_fkey;
       public          postgres    false    213    210    3205                  x������ � �            x������ � �            x������ � �     