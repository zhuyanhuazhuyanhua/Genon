const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const neo4j = require('neo4j-driver');

// 配置Neo4j Aura数据库连接信息
const NEO4J_URI = 'neo4j+ssc://0586fc5a.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = '6NV5GEfVeqyKg3B49iaMxBG2PzkwJ5Kdd9qoDhXg4Xw';

// 初始化Neo4j驱动
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

// 云函数入口
exports.main = async (event, context) => {
    const session = driver.session();
    try {
        // 获取输入的两个节点名称
        const { name1, name2 } = event;
        if (!name1 || !name2) {
            return { error: 'Missing name1 or name2 in the request' };
        }

        // 使用公共邻居算法计算相似度
        const query = `
        MATCH (n1 {name: $name1})-[*1]->(common)<-[*1]-(n2 {name: $name2})
        WITH COUNT(common) AS commonNeighbors, n1, n2
        OPTIONAL MATCH (n1)-[*1]->(f1)
        WITH commonNeighbors, COUNT(f1) AS neighbors1, n2
        OPTIONAL MATCH (n2)-[*1]->(f2)
        WITH commonNeighbors, neighbors1, COUNT(f2) AS neighbors2
        RETURN 
          CASE 
            WHEN neighbors1 = 0 OR neighbors2 = 0 THEN 0.0
            ELSE commonNeighbors / SQRT(neighbors1 * neighbors2)
          END AS similarity
        LIMIT 1
        `;

        const result = await session.run(query, { name1, name2 });
       // console.log('result:', result); // 添加打印 result.records.length 到控制台

        // 返回结果
        return result.records.length > 0
            ? { similarity: result.records[0]._fields[0]}  // 直接访问 _fields 数组的第一个元素
            : { similarity: 0 };
            // : { similarity: 0 ,result,name1,name2};
    } catch (error) {
        console.error('Error executing query:', error);
        return { error: `Failed to calculate similarity: ${error.message}`, details: error };
    } finally {
        await session.close();
        // await driver.close(); // 这里关闭 driver 可能导致后续请求失败，建议只在应用完全结束时关闭
    }
};