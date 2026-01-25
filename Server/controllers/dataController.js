const dataModel = require("../models/data");



// Line Chart 
const intensityByYear = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { end_year: { $ne: "" } } },
            { $addFields: { yearNum: { $toInt: "$end_year" } } },
            { $match: { yearNum: { $gte: 1900, $lte: 2100 } } },
            {
                $group: {
                    _id: "$end_year",
                    value: { $avg: "$intensity" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Bar Chart
const likelihoodByCountry = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { country: { $ne: "" } } },
            {
                $group: {
                    _id: "$country",
                    value: { $avg: "$likelihood" }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 15 }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Donut Chart
const regionDistribution = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { region: { $ne: "" } } },
            {
                $group: {
                    _id: "$region",
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Area Chart 
const yearTrend = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { end_year: { $ne: "" } } },
            { $addFields: { yearNum: { $toInt: "$end_year" } } },
            { $match: { yearNum: { $gte: 1900, $lte: 2100 } } },
            {
                $group: {
                    _id: "$end_year",
                    value: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Pie Chart
const pestleDistribution = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { pestle: { $ne: "" } } },
            {
                $group: {
                    _id: "$pestle",
                    value: { $sum: 1 }
                }
            }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Donut Chart - Sector Distribution
const sectorDistribution = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { sector: { $ne: "" } } },
            {
                $group: {
                    _id: "$sector",
                    value: { $sum: "$intensity" }
                }
            },
            { $sort: { value: -1 } }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Radar Chart - Topic Distribution
const topicDistribution = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { topic: { $ne: "" } } },
            {
                $group: {
                    _id: "$topic",
                    value: { $sum: "$relevance" }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 10 }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Radar Chart 
const swotAnalysis = async (req, res) => {
    try {
        const data = await dataModel.aggregate([
            { $match: { swot: { $ne: "" } } },
            {
                $group: {
                    _id: "$swot",
                    value: { $avg: "$relevance" }
                }
            }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
 
const getKPI = async (req, res) => {
  try {
    const totalRecords = await dataModel.countDocuments();

    const avgIntensity = await dataModel.aggregate([
      { $group: { _id: null, avg: { $avg: "$intensity" } } }
    ]);

    const avgLikelihood = await dataModel.aggregate([
      { $group: { _id: null, avg: { $avg: "$likelihood" } } }
    ]);

    const avgRelevance = await dataModel.aggregate([
      { $group: { _id: null, avg: { $avg: "$relevance" } } }
    ]);

    const topSector = await dataModel.aggregate([
      { $group: { _id: "$sector", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const topCountry = await dataModel.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      totalRecords,
      avgIntensity: avgIntensity[0]?.avg || 0,
      avgLikelihood: avgLikelihood[0]?.avg || 0,
      avgRelevance: avgRelevance[0]?.avg || 0,
      topSector: topSector[0]?._id || "N/A",
      topCountry: topCountry[0]?._id || "N/A"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
    intensityByYear,
     likelihoodByCountry, 
     regionDistribution,
      yearTrend, 
      pestleDistribution, 
      swotAnalysis,
      sectorDistribution,
      topicDistribution,
      getKPI 
}


