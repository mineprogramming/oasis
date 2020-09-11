IDRegistry.genItemID("coconut");
Item.createFoodItem("coconut", "Coconut", {name: "coconut", data: 0}, {food: 5});

Item.registerUseFunction("coconut", function(coords, item, block){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (World.canTileBeReplaced(tile1.id, tile1.data) && tile2.id == VanillaBlockID.sand) {
		World.setBlock(place.x, place.y, place.z, BlockID.coconutBlock);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("coconutBlock");
Block.createBlock("coconutBlock", [
	{name: "Palm Sapling", texture: [["coconut", 0]], inCreative: false}
]);
Block.setDestroyTime(BlockID.coconutBlock, 0);
ToolAPI.registerBlockMaterial(BlockID.coconutBlock, "plant");
TileRenderer.setPlantModel(BlockID.coconutBlock, 0, "coconut", 0);

Block.registerDropFunction("coconutBlock", function(){
	return [[ItemID.coconut, 1, 0]];
});