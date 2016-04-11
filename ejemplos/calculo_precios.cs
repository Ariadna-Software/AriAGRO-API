#region Cálculo de precios
                
        public static Precio GetPrecio(Articulo a, Cliente c)
        {
            Precio precio = new Precio();
            bool precioMinimo = GetPrecioMinimo();
            if (!precioMinimo)
            {
                precio = GetPrecioPromocion(a, c);
                if (precio.Pvp != 0)
                    return precio;
                precio = GetPrecioEspeciales(a, c);
                if (precio.Pvp != 0)
                    return precio;
                precio = GetPrecioTarifas(a, c);
                if (precio.Pvp != 0)
                    return precio;
                precio = GetPrecioArticulo(a, c);
            }
            else
            {
                Precio pAux = new Precio();
                pAux.Importe = 9999999;
                pAux.Origen = "ERROR";
                precio = GetPrecioPromocion(a, c);
                if (precio.Importe != 0 && precio.Importe < pAux.Importe)
                    pAux = precio;
                precio = GetPrecioEspeciales(a, c);
                if (precio.Importe != 0 && precio.Importe < pAux.Importe)
                    pAux = precio;
                precio = GetPrecioTarifas(a, c);
                if (precio.Importe != 0 && precio.Importe < pAux.Importe)
                    pAux = precio;
                precio = GetPrecioArticulo(a, c);
                if (precio.Importe != 0 && precio.Importe < pAux.Importe)
                    pAux = precio;
                precio = pAux;
            }
            return precio;
        }

        public static bool GetPrecioMinimo()
        {
            bool precioMinimo = false;
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    preciominimo AS PRECIOMINIMO
                    FROM spara1";
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precioMinimo = rdr.GetBoolean("PRECIOMINIMO");
                }
                conn.Close();
            }
            return precioMinimo;
        }

        public static bool GetSobreResto()
        {
            bool sobreResto = false;
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    tipodtos AS TIPODTOS
                    FROM spara1";
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    sobreResto = rdr.GetBoolean("TIPODTOS");
                }
                conn.Close();
            }
            return sobreResto;
        }
                
        public static Precio GetPrecioPromocion(Articulo a, Cliente c)
        {
            Precio precio = new Precio();
            bool dtoPermi = false;
            precio.Origen = "PROMOCION";
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    dtopermi AS DTOPERMI,
                    precioac AS PRECIOAC
                    FROM spromo
                    WHERE codartic = '{0}'
                    AND codlista = {1}
                    AND (fechaini <= '{2:yyyy-MM-dd}' AND fechafin >= '{2:yyyy-MM-dd}');
                ";
                sql = String.Format(sql, a.CodArtic, c.CodTarif, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precio.Pvp = rdr.GetDecimal("PRECIOAC");
                    dtoPermi = rdr.GetBoolean("DTOPERMI");
                }
                conn.Close();
            }
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    dtopermi AS DTOPERMI,
                    precion1 AS PRECIONU
                    FROM spromo
                    WHERE codartic = '{0}'
                    AND codlista = {1}
                    AND (fechain1 >= '{2:yyyy-MM-dd}' AND fechafi1 <= '{2:yyyy-MM-dd}');
                ";
                sql = String.Format(sql, a.CodArtic, c.CodTarif, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precio.Pvp = rdr.GetDecimal("PRECIONU");
                    dtoPermi = rdr.GetBoolean("DTOPERMI");
                }
                conn.Close();
            }
            if (precio.Pvp != 0 && dtoPermi)
            {
                // calcular los descuentos
                precio = GetDescuento(a, c, precio);
            }
            precio = CalcularDescuento(precio);
            return precio;
        }
                
        public static Precio GetPrecioEspeciales(Articulo a, Cliente c)
        {
            Precio precio = new Precio();
            bool dtoPermi = false;
            precio.Origen = "ESPECIAL";
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    dtopermi AS DTOPERMI,
                    precioac AS PRECIOAC,
                    dtoespec AS DTOESPEC
                    FROM sprees
                    WHERE codclien = {0}
                    AND codartic = '{1}';
                ";
                sql = String.Format(sql, c.CodClien, a.CodArtic);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precio.Pvp = rdr.GetDecimal("PRECIOAC");
                    dtoPermi = rdr.GetBoolean("DTOPERMI");
                    if (!rdr.IsDBNull(rdr.GetOrdinal("DTOESPEC")))
                        precio.Dto1 = rdr.GetDecimal("DTOESPEC");
                }
                conn.Close();
            }
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    dtopermi AS DTOPERMI,
                    precionu AS PRECIONU,
                    dtoespe1 AS DTOESPE1
                    FROM sprees
                    WHERE codclien = {0}
                    AND codartic = '{1}'
                    AND (fechanue <= '{2:yyyy-MM-dd}');
                ";
                sql = String.Format(sql, c.CodClien, a.CodArtic, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precio.Pvp = rdr.GetDecimal("PRECIONU");
                    dtoPermi = rdr.GetBoolean("DTOPERMI");
                    if (!rdr.IsDBNull(rdr.GetOrdinal("DTOESPE1")))
                        precio.Dto1 = rdr.GetDecimal("DTOESPE1");
                }
                conn.Close();
            }
            if (precio.Pvp != 0 && dtoPermi && precio.Dto1 == 0)
            {
                // calcular los descuentos
                precio = GetDescuento(a, c, precio);
            }
            precio = CalcularDescuento(precio);
            return precio;
        }
                
        public static Precio GetPrecioTarifas(Articulo a, Cliente c)
        {
            Precio precio = new Precio();
            bool dtoPermi = false;
            precio.Origen = "TARIFAS";
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    dtopermi AS DTOPERMI,
                    precioac AS PRECIOAC
                    FROM slista
                    WHERE codlista = {0}
                    AND codartic = '{1}';
                ";
                sql = String.Format(sql, c.CodTarif, a.CodArtic);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precio.Pvp = rdr.GetDecimal("PRECIOAC");
                    dtoPermi = rdr.GetBoolean("DTOPERMI");
                }
                conn.Close();
            }
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"SELECT 
                    dtopermi AS DTOPERMI,
                    precionu AS PRECIONU
                    FROM slista
                    WHERE codlista = {0}
                    AND codartic = '{1}'
                    AND (fechanue <= '{2:yyyy-MM-dd}');
                ";
                sql = String.Format(sql, c.CodTarif, a.CodArtic, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    precio.Pvp = rdr.GetDecimal("PRECIONU");
                    dtoPermi = rdr.GetBoolean("DTOPERMI");
                }
                conn.Close();
            }
            if (precio.Pvp != 0 && dtoPermi)
            {
                // calcular los descuentos
                precio = GetDescuento(a, c, precio);
            }
            precio = CalcularDescuento(precio);
            return precio;
        }

        public static Precio GetPrecioArticulo(Articulo a, Cliente c)
        {
            Precio precio = new Precio();
            precio.Origen = "ARTICULO";
            precio.Pvp = a.Preciove;
            //precio = GetDescuento(a, c, precio);
            precio = CalcularDescuento(precio);
            return precio;
        }
            
        public static Precio CalcularDescuento(Precio p)
        {
            bool sobreResto = GetSobreResto();
            if (sobreResto)
            {
                p.Importe = p.Pvp - ((p.Pvp * p.Dto1) / 100M);
                p.Importe = p.Importe - ((p.Importe * p.Dto2) / 100M);
            }
            else
            {
                p.Importe = p.Pvp - ((p.Pvp * (p.Dto1 + p.Dto2)) / 100M);
            }
            return p;
        }
            
        public static Precio GetDescuento(Articulo a, Cliente c, Precio p)
        {
            // segun cliente
            p = GetDescuentoCFM(a, c, p);
            if (p.Dto1 > 0)
                return p;
            p = GetDescuentoCF(a, c, p);
            if (p.Dto1 > 0)
                return p;
            p = GetDescuentoCM(a, c, p);
            if (p.Dto1 > 0)
                return p;
            // segun actividad
            p = GetDescuentoAFM(a, c, p);
            if (p.Dto1 > 0)
                return p;
            p = GetDescuentoAF(a, c, p);
            if (p.Dto1 > 0)
                return p;
            p = GetDescuentoAM(a, c, p);
            if (p.Dto1 > 0)
                return p;
            return p;
        }

        public static Precio GetDescuentoCFM(Articulo a, Cliente c, Precio p)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"
                    SELECT
                    dtoline1 AS DTOLINE1,
                    dtoline2 AS DTOLINE2
                    FROM sdtofm
                    WHERE codclien = {0}
                    AND codfamia = {1}
                    AND codmarca = {2}
                    AND fechadto <= '{3:yyyy-MM-dd}';
                ";
                sql = String.Format(sql, c.CodClien, a.CodFamia, a.CodMarca, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    p.Dto1 = rdr.GetDecimal("DTOLINE1");
                    p.Dto2 = rdr.GetDecimal("DTOLINE2");
                }
                conn.Close();
            }
            return p;
        }

        public static Precio GetDescuentoCF(Articulo a, Cliente c, Precio p)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"
                    SELECT
                    dtoline1 AS DTOLINE1,
                    dtoline2 AS DTOLINE2
                    FROM sdtofm
                    WHERE codclien = {0}
                    AND codfamia = {1}
                    AND fechadto <= '{2:yyyy-MM-dd}';
                ";
                sql = String.Format(sql, c.CodClien, a.CodFamia, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    p.Dto1 = rdr.GetDecimal("DTOLINE1");
                    p.Dto2 = rdr.GetDecimal("DTOLINE2");
                }
                conn.Close();
            }
            return p;
        }

        public static Precio GetDescuentoCM(Articulo a, Cliente c, Precio p)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"
                    SELECT
                    dtoline1 AS DTOLINE1,
                    dtoline2 AS DTOLINE2
                    FROM sdtofm
                    WHERE codclien = {0}
                    AND codmarca = {1}
                    AND fechadto <= '{2:yyyy-MM-dd}';
                ";
                sql = String.Format(sql, c.CodClien, a.CodMarca, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    p.Dto1 = rdr.GetDecimal("DTOLINE1");
                    p.Dto2 = rdr.GetDecimal("DTOLINE2");
                }
                conn.Close();
            }
            return p;
        }

        public static Precio GetDescuentoAFM(Articulo a, Cliente c, Precio p)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"
                    SELECT
                    dtoline1 AS DTOLINE1,
                    dtoline2 AS DTOLINE2
                    FROM sdtofm
                    WHERE codactiv = {0}
                    AND codfamia = {1}
                    AND codmarca = {2}
                    AND fechadto <= '{3:yyyy-MM-dd}';
                ";
                sql = String.Format(sql, c.CodActiv, a.CodFamia, a.CodMarca, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    p.Dto1 = rdr.GetDecimal("DTOLINE1");
                    p.Dto2 = rdr.GetDecimal("DTOLINE2");
                }
                conn.Close();
            }
            return p;
        }
        
        public static Precio GetDescuentoAF(Articulo a, Cliente c, Precio p)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"
                    SELECT
                    dtoline1 AS DTOLINE1,
                    dtoline2 AS DTOLINE2
                    FROM sdtofm
                    WHERE codactiv = {0}
                    AND codfamia = {1}
                    AND fechadto <= '{2:yyyy-MM-dd}';
                ";
                sql = String.Format(sql, c.CodActiv, a.CodFamia, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    p.Dto1 = rdr.GetDecimal("DTOLINE1");
                    p.Dto2 = rdr.GetDecimal("DTOLINE2");
                }
                conn.Close();
            }
            return p;
        }

        public static Precio GetDescuentoAM(Articulo a, Cliente c, Precio p)
        {
            using (MySqlConnection conn = GetConnection())
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                string sql = @"
                    SELECT
                    dtoline1 AS DTOLINE1,
                    dtoline2 AS DTOLINE2
                    FROM sdtofm
                    WHERE codactiv = {0}
                    AND codmarca = {1}
                    AND fechadto <= '{2:yyyy-MM-dd}';
                ";
                sql = String.Format(sql, c.CodActiv, a.CodMarca, DateTime.Now);
                cmd.CommandText = sql;
                MySqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    p.Dto1 = rdr.GetDecimal("DTOLINE1");
                    p.Dto2 = rdr.GetDecimal("DTOLINE2");
                }
                conn.Close();
            }
            return p;
        }

        #endregion 
        