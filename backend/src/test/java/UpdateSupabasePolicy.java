import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class UpdateSupabasePolicy {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://db.hsqcivtwxrwzlpwymmot.supabase.co:5432/postgres?sslmode=require";
        String user = "postgres";
        String password = "Sujipraveen@2724";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {

            System.out.println("Connected to Supabase DB!");

            // 1. Allow INSERT for anyone
            String sql1 = "CREATE POLICY \"Allow public uploads\" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'profiles' OR bucket_id = 'work-samples');";
            try { stmt.execute(sql1); System.out.println("Policy 'Allow public uploads' created."); } catch (Exception e) { System.out.println("Insert Policy exists or error: " + e.getMessage()); }

            // 2. Allow UPDATE for anyone
            String sql2 = "CREATE POLICY \"Allow public updates\" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'profiles' OR bucket_id = 'work-samples');";
            try { stmt.execute(sql2); System.out.println("Policy 'Allow public updates' created."); } catch (Exception e) { System.out.println("Update Policy exists or error: " + e.getMessage()); }

            // 3. Allow DELETE for anyone
            String sql3 = "CREATE POLICY \"Allow public deletes\" ON storage.objects FOR DELETE TO public USING (bucket_id = 'profiles' OR bucket_id = 'work-samples');";
            try { stmt.execute(sql3); System.out.println("Policy 'Allow public deletes' created."); } catch (Exception e) { System.out.println("Delete Policy exists or error: " + e.getMessage()); }
            
            // Allow SELECT just in case (though it's a public bucket usually)
            String sql4 = "CREATE POLICY \"Allow public viewing\" ON storage.objects FOR SELECT TO public USING (bucket_id = 'profiles' OR bucket_id = 'work-samples');";
            try { stmt.execute(sql4); System.out.println("Policy 'Allow public viewing' created."); } catch (Exception e) { System.out.println("Select Policy exists or error: " + e.getMessage()); }

            System.out.println("Done updating storage policies.");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
