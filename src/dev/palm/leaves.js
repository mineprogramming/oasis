/**
 * Palm leaves mechanics, mostly taken from IndustrialCraft_2
 * https://github.com/MineExplorer/IndustrialCraft_2
 */

var SAPLING_DROP_CHANCE = 0.07;

IDRegistry.genBlockID("palmLeaves");
Block.createBlock("palmLeaves", [
	{name: "Palm Leaves", texture: [["palm_leaves", 0]], inCreative: false},
	{name: "Palm Leaves", texture: [["palm_leaves", 0]], inCreative: false},
	{name: "Palm Leaves", texture: [["palm_leaves", 0]], inCreative: true}
]);

Block.registerDropFunction("palmLeaves", function(coords, blockID, blockData, level, enchant){
	if(level > 0 || Player.getCarriedItem().id == 359){
		return [[blockID, 1, 2]];
	}
	if(Math.random() < SAPLING_DROP_CHANCE){
		return [[ItemID.rubberSapling, 1, 0]]
	}
	return [];
});

Block.setDestroyTime(BlockID.palmLeaves, 0.2);
ToolAPI.registerBlockMaterial(BlockID.palmLeaves, "plant");

function checkLeaves(x, y, z, explored){
	let blockID = World.getBlockID(x, y, z);
	if(blockID == BlockID.palmLog){
		return true;
	}
	if(blockID == BlockID.palmLeaves){
		explored[x+':'+y+':'+z] = true;
	}
	return false;
}

function checkLeavesBox(x, y, z, explored){
	var result = false;
	for(let xx = x - 1; xx <= x + 1; xx++){
		for(let yy = y - 1; yy <= y + 1; yy++){
			for(let zz = z - 1; zz <= z + 1; zz++){
				result ||= checkLeaves(xx, yy, zz, explored);
			}
		}
	}
	return result
}

function updateLeaves(x, y, z){
	for(let xx = x - 1; xx <= x + 1; xx++){
		for(let yy = y - 1; yy <= y + 1; yy++){
			for(let zz = z - 1; zz <= z + 1; zz++){
				let block = World.getBlock(xx, yy, zz);
				if(block.id == BlockID.palmLeaves && block.data == 0){
					World.setBlock(xx, yy, zz, BlockID.palmLeaves, 1);
				}
			}
		}
	}
}

Block.setRandomTickCallback(BlockID.palmLeaves, function(x, y, z, id, data){
	if(data == 1){
		let explored = {};
		explored[x+':'+y+':'+z] = true;
		for(let i = 0; i < 4; i++){
			let checkingLeaves = explored;
			explored = {};
			for(let coords in checkingLeaves){
				let c = coords.split(':');
				if(checkLeavesBox(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]), explored)){
					World.setBlock(x, y, z, BlockID.palmLeaves, 0);
					return;
				}
			}
		}
		World.setBlock(x, y, z, 0);
		updateLeaves(x, y, z);
		let dropFunc = Block.dropFunctions[id];
		let drop = dropFunc(null, id, data, 0, {});
		for(let i in drop){
			World.drop(x, y, z, drop[i][0], drop[i][1], drop[i][2]);
		}
	}
});

Callback.addCallback("DestroyBlock", function(coords, block, player){
	updateLeaves(coords.x, coords.y, coords.z);
});