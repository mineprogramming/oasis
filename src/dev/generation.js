/**
 * Generator settings
 */
const PALM_DENSITY = 4;

const OASIS_GENERATION_THRESHOLD = 0.85;
const LAKE_GENERATION_THRESHOLD = 0.93;

const OCTAVE_SCALE = 48;


/**
 * Biome map generation
 */
Callback.addCallback("GenerateBiomeMap", function(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed) {
    // Check if it is overworld
    if (dimensionId != 0) {
        return;
    }
    
    var cornerX = chunkX * 16;
    var cornerZ = chunkZ * 16;

    // Check if it is one of the deset biomes
    var biome = World.getBiomeMap(cornerX + 8, cornerZ + 8);
    if(biome != 2 && biome != 130){
        return;
    }

    // Check if the biome is likely to be generated inside this chunk
    if (GenerationUtils.getPerlinNoise(cornerX + 8, 0, cornerZ + 8, dimensionSeed, 1 / OCTAVE_SCALE, 2) 
            < OASIS_GENERATION_THRESHOLD - 12 / OCTAVE_SCALE) {
        return;
    }

    // Biome map changes
    for (var x = cornerX; x < cornerX + 16; x++) {
        for (var z = cornerZ; z < cornerZ + 16; z++) {
            var noiseValue = GenerationUtils.getPerlinNoise(x, 0, z, dimensionSeed, 1 / OCTAVE_SCALE, 2);
            if (noiseValue > LAKE_GENERATION_THRESHOLD) {
                // Generate lakes
                World.setBiomeMap(x, z, biomeLake.id);
            } else if (noiseValue > OASIS_GENERATION_THRESHOLD){
                // Generate surrounding landscape
                World.setBiomeMap(x, z, biomeOasis.id);
            }
        }
    }
});


/**
 * Mod generation
 */
Callback.addCallback("GenerateChunk", function(chunkX, chunkZ, random, dimensionId, chunkSeed, worldSeed, dimensionSeed) {
    var cornerX = chunkX * 16;
    var cornerZ = chunkZ * 16;

    // Check if it is one of mod's biomes
    var biome = World.getBiome(cornerX + 8, cornerZ + 8);
    if(biome == biomeOasis.id){
        for(var i = 0; i < PALM_DENSITY; i++){
            var coords = GenerationUtils.randomXZ(chunkX, chunkZ);
            coords = GenerationUtils.findHighSurface(coords.x, coords.z);
            ModGenerator.generatePalm(coords.x, coords.y, coords.z);
        }
    }
});


/**
 * Mod generation utility functions
 */
var ModGenerator = {
    _diagonals: [[1, 1], [1, -1], [-1, -1], [-1, 1]],
    _directions: [[1, 0], [0, 1], [-1, 0], [0, -1]],

    /**
     * Generates palm on the specified coordinates
     */
    generatePalm: function(x, y, z){
        var height = random(5, 7);

        // Trunk
        for(var i = 0; i < height - 1; i++){
            World.setBlock(x, y + i, z, BlockID.palmLog, 0);
        }

        World.setBlock(x, y + height - 1, z, BlockID.palmLogFruitful, 0);
        
        World.setBlock(x, y + height, z, BlockID.palmLeaves, 0);

        for(var i = 0; i < 4; i++){
            this._generatePalmLeavesRecursively(x, y + height, z, i, random(1, 2));
            if(Math.random() > 0.5){
                this.generateCoconut(x, y + height - 1, z);
            }
        }
    },

    generateCoconut: function(x, y, z){
        var direction = this._directions[random(0, 3)];
        World.setBlock(x + direction[0], y, z + direction[1], BlockID.coconutBlock, 0);
    },

    _generatePalmLeavesRecursively: function(x, y, z, direction, depth){
        var dir = this._diagonals[direction];
        x += dir[0];
        y -= Math.round(Math.random());
        z += dir[1];

        // Generate only in the air
        var tile = World.getBlock(x, y, z);
        if(!World.canTileBeReplaced(tile.id, tile.data) != 0){
            return;
        }

        World.setBlock(x, y, z, BlockID.palmLeaves, 0);

        // Generate only *depth* blocks
        if(depth-- > 0){
            this._generatePalmLeavesRecursively(x, y, z, direction, depth);
        }
    }
}

// Callback.addCallback("ItemUse", function(coords, item, block){
//     if(item.id != ItemID.palmSapling){
//         ModGenerator.generatePalm(coords.relative.x, coords.relative.y, coords.relative.z);
//     }
    
// });

