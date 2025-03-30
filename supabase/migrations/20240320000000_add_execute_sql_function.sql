-- Create a function to execute SQL queries safely
CREATE OR REPLACE FUNCTION execute_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- Only allow SELECT queries
  IF NOT (LOWER(TRIM(query)) LIKE 'select%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;

  -- Prevent access to sensitive tables
  IF (
    LOWER(query) LIKE '%auth%' OR
    LOWER(query) LIKE '%pg_%' OR
    LOWER(query) LIKE '%information_schema%' OR
    LOWER(query) LIKE '%pg_catalog%'
  ) THEN
    RAISE EXCEPTION 'Access to sensitive tables is not allowed';
  END IF;

  -- Execute the query
  EXECUTE query INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_sql TO authenticated; 