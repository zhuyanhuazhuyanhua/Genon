const neo4j = require('neo4j-driver');

// Neo4j 配置
const NEO4J_URI = "neo4j+ssc://0586fc5a.databases.neo4j.io";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "6NV5GEfVeqyKg3B49iaMxBG2PzkwJ5Kdd9qoDhXg4Xw";

// 初始化 Neo4j 驱动
const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

exports.main = async (event, context) => {
  const { set1, set2 } = event;

  // 将集合转换为 Cypher 查询参数
  const params = {
    set1: set1.split(','),
    set2: set2.split(',')
  };

  try {
    const session = driver.session();

    // 计算交集和并集
    const result = await session.run(`
      WITH $set1 AS set1, $set2 AS set2
      WITH set1, set2, 
           size(apoc.coll.intersection(set1, set2)) AS intersectionSize,
           size(apoc.coll.union(set1, set2)) AS unionSize
      RETURN intersectionSize / unionSize AS similarity
    `, params);

    const similarity = result.records[0].get('similarity');

    await session.close();
    return {
      similarity: similarity,
      message: "Similarity calculated successfully"
    };
  } catch (error) {
    console.error("Error calculating similarity:", error);
    return {
      error: "Failed to calculate similarity",
      message: error.message
    };
  } finally {
    await driver.close();
  }
};