#!/bin/sh

psql "dbname='postgres' user='postgres' password='sD7IglOj8fwQacT3' host='db.rbakrhawjgkpcctivmmx.supabase.co'" -f ./scripts/init.sql
