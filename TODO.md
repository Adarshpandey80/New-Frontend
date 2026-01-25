# DonutChart Data Fix - TODO List

## Steps:
1. Add `sectorDistribution` controller function in `dataController.js` ✅
2. Add `/sector` route in `dataRouter.js` ✅
3. Update DonutChart to use new `/data/sector` endpoint ✅
4. Add `topicDistribution` controller function in `dataController.js` ✅
5. Add `/topic` route in `dataRouter.js` ✅
6. RadarChart now uses working `/data/topic` endpoint ✅
7. Fix LineChart NaN error - added logging, robust filtering, Number() conversion ✅
8. Fix AreaChart NaN error - added logging, robust filtering, Number() conversion ✅
9. Fix backend controllers to filter valid years (1900-2100) using $toInt ✅

## Status: Completed ✅

