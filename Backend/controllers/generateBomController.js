const Template = require('../models/templatesModel');

const generateBOM = async (req, res) => {
  const { totalArea, numFloors, avgFloorHeight, templateTier } = req.body;

  try {
   
    const baseTemplate = await Template.findOne({ tier: templateTier });

    if (!baseTemplate) {
      return res.status(404).json({ error: "Base template not found." });
    }

  
    const scaledMaterials = {};
    for (const [material, baseQuantity] of Object.entries(baseTemplate.baseBOM.materials)) {
      if (typeof baseQuantity === 'number') { 
        const scaleFactor = (totalArea / baseTemplate.baseBOM.totalArea) * 
                           (numFloors / baseTemplate.baseBOM.numFloors) * 
                           (avgFloorHeight / baseTemplate.baseBOM.avgFloorHeight);
        scaledMaterials[material] = baseQuantity * scaleFactor;
      }
    }

    
    const bom = {
      projectDetails: {
        totalArea,
        numFloors,
        avgFloorHeight,
      },
      materials: scaledMaterials
    };

    res.status(200).json({ success: true, bom });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate BOM.", details: error.message });
  }
};

module.exports = { generateBOM };
