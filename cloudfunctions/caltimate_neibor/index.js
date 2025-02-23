const neo4j = require('neo4j-driver');
const { basic } = require('neo4j-driver/auth');

// 配置Neo4j Aura数据库连接信息
const NEO4J_URI = 'neo4j+ssc://0586fc5a.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = '6NV5GEfVeqyKg3B49iaMxBG2PzkwJ5Kdd9qoDhXg4Xw';

// 初始化Neo4j驱动
const driver = neo4j.driver(NEO4J_URI, basic(NEO4J_USER, NEO4J_PASSWORD));

// 云函数入口
modules.export.main=async(event, context) => {
    try {
        // 获取输入的两个节点名称
        const { name1, name2 } = event;
        if (!name1 || !name2) {
            return { error: 'Missing name1 or name2 in the request' };
        }

        // 创建会话
        const session = driver.session();

        // 使用公共邻居算法计算相似度
        const query = `
        // 第一步：计算共同邻居
        MATCH (n1 {name: $name1})
        OPTIONAL MATCH (n1)-[*1..3]->(common)<-[*1..3]-(n2 {name: $name2})
        WITH COUNT(common) AS commonNeighbors, n1, n2

        // 第二步：计算各自的邻居数量
        OPTIONAL MATCH (n1)-[*1..3]->(f1)
        WITH commonNeighbors, COUNT(f1) AS neighbors1, n2
        OPTIONAL MATCH (n2)-[*1..3]->(f2)
        WITH commonNeighbors, neighbors1, COUNT(f2) AS neighbors2

        // 第三步：计算相似度
        RETURN 
          CASE 
            WHEN neighbors1 = 0 OR neighbors2 = 0 THEN 0.0
            ELSE commonNeighbors / SQRT(neighbors1 * neighbors2)
          END AS similarity
        `;

        const result = await session.run(query, { name1, name2 });

        // 关闭会话
        await session.close();

        // 返回结果
        if (result.records.length > 0) {
            return { similarity: result.records[0].get('similarity').toNumber() };
        } else {
            return { similarity: 0 };
        }
    } catch (error) {
        console.error('Error executing query:', error);
        return { error: 'Failed to calculate similarity' };
    } finally {
        // 关闭驱动
        await driver.close();
    }
}
