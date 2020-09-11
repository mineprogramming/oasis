/**
 * Palm trunk block
 */
IDRegistry.genBlockID("palmLog");
Block.createBlock("palmLog", [
	{name: "Palm Trunk", texture: [["palm_log", 1], ["palm_log", 1], ["palm_log", 0], ["palm_log", 0], ["palm_log", 0], ["palm_log", 0]], inCreative: true}
], "opaque");
Block.registerDropFunction("palmLog", function(coords, blockID){
	return [[blockID, 1, 0]];
});
Block.setDestroyTime(BlockID.palmLog, 0.4);
ToolAPI.registerBlockMaterial(BlockID.palmLog, "wood");

// To generate coconuts
IDRegistry.genBlockID("palmLogFruitful");
Block.createBlock("palmLogFruitful", [
	{name: "Palm Trunk", texture: [["palm_log", 1], ["palm_log", 1], ["palm_log", 0], ["palm_log", 0], ["palm_log", 0], ["palm_log", 0]], inCreative: false}
], "opaque");
Block.registerDropFunction("palmLogFruitful", function(coords, blockID){
	return [[BlockID.palmLog, 1, 0]];
});
Block.setDestroyTime(BlockID.palmLogFruitful, 0.4);
ToolAPI.registerBlockMaterial(BlockID.palmLogFruitful, "wood");


Block.setRandomTickCallback(BlockID.palmLogFruitful, function(x, y, z){
	if(Math.random() < 0.2 && World.getLightLevel(x, y + 1, z) >= 9){
		ModGenerator.generateCoconut(x, y, z);
	}
});


// Recipe
Recipes.addShapeless({id: 5, count: 4, data: 3}, [{id: BlockID.palmLog, data: -1}]);