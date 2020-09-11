/**
 * Generator settings
 */
const PALM_DENSITY = 8;

const OASIS_GENERATION_THRESHOLD = 0.7;
const LAKE_GENERATION_THRESHOLD = 0.9;

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
    if(biome != 2 && biome != 17 && biome != 130){
        return;
    }

    // Check if the biome is likely to be generated inside this chunk
    if (GenerationUtils.getPerlinNoise(cornerX + 8, 0, cornerZ + 8, dimensionSeed, 1 / OCTAVE_SCALE, 2) < 0.7 - 12 / OCTAVE_SCALE) {
        return;
    }

    // Biome map changes
    for (var x = cornerX; x < cornerX + 16; x++) {
        for (var z = cornerX; z < cornerX + 16; z++) {
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
            generatePalm(coords.x, GenerationUtils.findHighSurface(coords.x, coords.z), coords.z);
        }
    }
});


/**
 * Mod generation utility functions
 */
var ModGenerator = {
    /**
     * Generates palm on the specified coordinates
     */
    generatePalm: function(x, y, z){
        // TODO: cool generation
        World.setBlock(x, y, z, VanillaBlockID.acacia_stairs, 0);
    }
}

