#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script checks if your app is ready for deployment to Render
 */

import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkPackageJson(filePath, requiredScripts) {
  try {
    const packageContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let allGood = true;
    
    requiredScripts.forEach(script => {
      if (packageContent.scripts && packageContent.scripts[script]) {
        log(`  ✅ Script "${script}" found`, 'green');
      } else {
        log(`  ❌ Script "${script}" missing`, 'red');
        allGood = false;
      }
    });
    
    return allGood;
  } catch (error) {
    log(`  ❌ Error reading ${filePath}`, 'red');
    return false;
  }
}

function main() {
  log('\n🚀 Deployment Readiness Check\n', 'blue');
  
  let allChecksPass = true;
  
  // Check essential files
  allChecksPass &= checkFile('render.yaml', 'render.yaml configuration file');
  allChecksPass &= checkFile('.env.example', '.env.example file');
  allChecksPass &= checkFile('DEPLOYMENT.md', 'Deployment guide');
  allChecksPass &= checkFile('package.json', 'Root package.json');
  allChecksPass &= checkFile('backend/package.json', 'Backend package.json');
  allChecksPass &= checkFile('frontend/package.json', 'Frontend package.json');
  
  // Check package.json scripts
  log('\n📦 Checking package.json scripts:', 'blue');
  allChecksPass &= checkPackageJson('package.json', ['build', 'start']);
  allChecksPass &= checkPackageJson('backend/package.json', ['start']);
  allChecksPass &= checkPackageJson('frontend/package.json', ['build']);
  
  // Check backend configuration
  log('\n⚙️  Checking backend configuration:', 'blue');
  try {
    const indexJs = fs.readFileSync('backend/src/index.js', 'utf8');
    
    if (indexJs.includes('process.env.NODE_ENV === "production"')) {
      log('  ✅ Production static file serving configured', 'green');
    } else {
      log('  ❌ Production static file serving not configured', 'red');
      allChecksPass = false;
    }
    
    if (indexJs.includes('cors')) {
      log('  ✅ CORS configuration found', 'green');
    } else {
      log('  ❌ CORS configuration missing', 'red');
      allChecksPass = false;
    }
  } catch (error) {
    log('  ❌ Error reading backend/src/index.js', 'red');
    allChecksPass = false;
  }
  
  // Check frontend configuration
  log('\n🌐 Checking frontend configuration:', 'blue');
  try {
    const axiosJs = fs.readFileSync('frontend/src/lib/axios.js', 'utf8');
    
    if (axiosJs.includes('import.meta.env.MODE === "development"')) {
      log('  ✅ Dynamic API URL configuration found', 'green');
    } else {
      log('  ❌ Dynamic API URL configuration missing', 'red');
      allChecksPass = false;
    }
  } catch (error) {
    log('  ❌ Error reading frontend/src/lib/axios.js', 'red');
    allChecksPass = false;
  }
  
  // Final result
  log('\n' + '='.repeat(50), 'blue');
  if (allChecksPass) {
    log('🎉 All checks passed! Your app is ready for deployment to Render.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Push your code to GitHub', 'yellow');
    log('2. Set up MongoDB Atlas', 'yellow');
    log('3. Deploy to Render using the guide in DEPLOYMENT.md', 'yellow');
  } else {
    log('❌ Some checks failed. Please fix the issues above before deploying.', 'red');
  }
  log('='.repeat(50), 'blue');
}

main();