/**
 * Palm sapling mechanics, mostly taken from IndustrialCraft_2
 * https://github.com/MineExplorer/IndustrialCraft_2
 */

IDRegistry.genItemID("palmSapling");
Item.createItem("palmSapling", "Palm Sapling", {name: "palm_sapling", data: 0});

Item.registerUseFunction("palmSapling", function(coords, item, block){
	var place = coords.relative;
	var tile1 = World.getBlock(place.x, place.y, place.z);
	var tile2 = World.getBlock(place.x, place.y - 1, place.z);
	
	if (World.canTileBeReplaced(tile1.id, tile1.data) && tile2.id == VanillaBlockID.sand) {
		World.setBlock(place.x, place.y, place.z, BlockID.palmTreeSapling);
		Player.setCarriedItem(item.id, item.count - 1, item.data);
	}
});

IDRegistry.genBlockID("palmTreeSapling");
Block.createBlock("palmTreeSapling", [
	{name: "Palm Sapling", texture: [["palm_sapling", 0]], inCreative: false}
]);
Block.setDestroyTime(BlockID.palmTreeSapling, 0);
ToolAPI.registerBlockMaterial(BlockID.palmTreeSapling, "plant");
TileRenderer.setPlantModel(BlockID.palmTreeSapling, 0, "palm_sapling", 0);

Block.registerDropFunction("palmTreeSapling", function(){
	return [[ItemID.palmSapling, 1, 0]];
});

Block.setRandomTickCallback(BlockID.palmTreeSapling, function(x, y, z){
	if(World.getBlockID(x, y-1, z) != VanillaBlockID.sand){
		World.destroyBlock(x, y, z, true);
	}
	else if(Math.random() < 0.1 && World.getLightLevel(x, y, z) >= 9){
		ModGenerator.generatePalm(x, y, z);
	}
});

// bone use
Callback.addCallback("ItemUse", function(coords, item, block){
	if(item.id == 351 && item.data == 15 && block.id == BlockID.palmTreeSapling){
		Player.setCarriedItem(item.id, item.count - 1, item.data);
		for(var i = 0; i < 16; i++){
			var px = coords.x + Math.random();
			var pz = coords.z + Math.random();
			var py = coords.y + Math.random(); 
			Particles.addFarParticle(ParticleType.happyVillager, px, py, pz, 0, 0, 0);
		}
		if(Math.random() < 0.25){
			ModGenerator.generatePalm(coords.x, coords.y, coords.z);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player){
	if(World.getBlockID(coords.x, coords.y+1, coords.z) == BlockID.palmTreeSapling){
		World.destroyBlock(coords.x, coords.y+1, coords.z, true);
    }
});
