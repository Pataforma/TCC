import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_TO_OPTIMIZE = [
  { name: 'vacina.jpg', maxWidth: 1920 },
  { name: 'vetparceiro3.png', maxWidth: 1200 },
  { name: 'perdido1.png', maxWidth: 1200 },
  { name: 'perdido3.png', maxWidth: 1200 },
  { name: 'perdido2.png', maxWidth: 1200 },
  { name: 'petperdido3.png', maxWidth: 800 }
];

async function optimizeImage(inputPath, outputPath, maxWidth) {
  try {
    console.log(`Otimizando: ${path.basename(inputPath)}`);
    
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Redimensionar se necessário
    if (metadata.width > maxWidth) {
      image.resize(maxWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Converter para WebP com qualidade otimizada
    await image
      .webp({ 
        quality: 80,
        effort: 6,
        nearLossless: true
      })
      .toFile(outputPath);
    
    const originalSize = metadata.size || 0;
    const optimizedStats = await fs.stat(outputPath);
    const compressionRatio = ((originalSize - optimizedStats.size) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} otimizado: ${compressionRatio}% de redução`);
    
  } catch (error) {
    console.error(`❌ Erro ao otimizar ${inputPath}:`, error.message);
  }
}

async function optimizeAllImages() {
  const assetsDir = path.join(__dirname, '../src/assets/imgs');
  
  console.log('🚀 Iniciando otimização de imagens...\n');
  
  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    const inputPath = path.join(assetsDir, imageConfig.name);
    const outputName = imageConfig.name.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(assetsDir, outputName);
    
    try {
      await fs.access(inputPath);
      await optimizeImage(inputPath, outputPath, imageConfig.maxWidth);
    } catch (error) {
      console.log(`⚠️ Arquivo não encontrado: ${imageConfig.name}`);
    }
  }
  
  console.log('\n🎉 Otimização concluída!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Atualizar imports nos componentes para usar as versões .webp');
  console.log('2. Garantir que todas as imagens usem o componente OptimizedImage');
  console.log('3. Remover as imagens originais grandes após confirmar que tudo funciona');
}

optimizeAllImages().catch(console.error); 