import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class UpdateDatabaseComments {
    public static void main(String[] args) {
        String url = "jdbc:mysql://121.43.96.127:3306/easy_joy_life_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "root";
        
        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement();
             BufferedReader reader = new BufferedReader(new FileReader("update-database-comments.sql"))) {
            
            System.out.println("连接数据库成功！");
            System.out.println("开始执行注释更新...\n");
            
            StringBuilder sqlBuilder = new StringBuilder();
            String line;
            int successCount = 0;
            
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                
                // 跳过注释和空行
                if (line.isEmpty() || line.startsWith("--")) {
                    continue;
                }
                
                sqlBuilder.append(line).append(" ");
                
                // 如果遇到分号，执行SQL
                if (line.endsWith(";")) {
                    String sql = sqlBuilder.toString().trim();
                    sqlBuilder.setLength(0);
                    
                    try {
                        stmt.execute(sql);
                        successCount++;
                        if (sql.startsWith("SELECT") && sql.contains("result")) {
                            System.out.println("✓ 执行成功");
                        }
                    } catch (Exception e) {
                        if (!e.getMessage().contains("doesn't exist")) {
                            System.err.println("执行失败: " + e.getMessage());
                        }
                    }
                }
            }
            
            System.out.println("\n============================================");
            System.out.println("✓ 数据库注释更新完成！");
            System.out.println("成功执行 " + successCount + " 条SQL语句");
            System.out.println("============================================");
            
        } catch (Exception e) {
            System.err.println("错误: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
