const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const neo4j = require('neo4j-driver');

// 配置Neo4j Aura数据库连接信息
const NEO4J_URI = 'neo4j+ssc://0586fc5a.databases.neo4j.io';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = '6NV5GEfVeqyKg3B49iaMxBG2PzkwJ5Kdd9qoDhXg4Xw';

// 初始化Neo4j驱动 (在全局作用域，只执行一次)
console.log('[top5] Initializing Neo4j driver...');
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));
console.log('[top5] Neo4j driver initialized.');

// 云函数入口
module.exports.main = async (event, context) => {
    try {
        // 获取输入的节点名称
        const { name } = event;
        if (!name) {
            return { error: 'Missing name in the request' };
        }

        // 创建会话
        const session = driver.session();

        // 使用公共邻居算法计算相似度
        const query = `
        MATCH (set1 {name: $name})
        OPTIONAL MATCH (set1)-[*1..3]->(common)<-[*1..3]-(n2)
        WITH COUNT(common) AS commonNeighbors, set1, n2

        OPTIONAL MATCH (set1)-[*1..3]->(f1)
        WITH commonNeighbors, COUNT(f1) AS neighbors1, n2
        OPTIONAL MATCH (n2)-[*1..3]->(f2)
        WITH commonNeighbors, neighbors1, COUNT(f2) AS neighbors2, n2

        RETURN n2.name AS name2, 
          CASE 
            WHEN neighbors1 = 0 OR neighbors2 = 0 THEN 0.0
            ELSE commonNeighbors / SQRT(neighbors1 * neighbors2)
          END AS similarity
        ORDER BY similarity DESC
        LIMIT 5
        `;

        const result = await session.run(query, { name });

        // 关闭会话
        await session.close();

        // 返回结果
        if (result.records.length > 0) {
            return {
                similarNodes: result.records.map(record => ({
                    name: record.get('name2'),
                    similarity: record.get('similarity').toNumber()
                }))
            };
        } else {
            return { similarNodes: [] };
        }
    } catch (error) {
        console.error('Error executing query:', error);
        return { error: 'Failed to retrieve similar nodes' };
    } finally {
        // 关闭驱动
        await driver.close();
    }
}