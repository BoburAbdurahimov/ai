/**
 * Deployment Module - Backup and restore deployment state
 */

const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');
const axios = require('axios');

const execAsync = promisify(exec);

/**
 * Backup deployment state
 */
async function backupDeployment(outputPath) {
  const deployment = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'vercel',
    state: {}
  };

  // Try to get Vercel deployment info
  try {
    const { stdout } = await execAsync('vercel ls --json', { 
      cwd: process.cwd() 
    });
    
    const deployments = JSON.parse(stdout);
    deployment.state.deployments = deployments;
    deployment.state.lastDeployment = deployments[0];
  } catch (error) {
    console.warn('Could not fetch Vercel deployment info:', error.message);
    deployment.state.error = error.message;
  }

  // Get environment variables (from Vercel if possible)
  try {
    const { stdout } = await execAsync('vercel env ls --json', {
      cwd: process.cwd()
    });
    
    deployment.state.environmentVariables = JSON.parse(stdout);
  } catch (error) {
    console.warn('Could not fetch Vercel environment variables');
  }

  await fs.writeFile(outputPath, JSON.stringify(deployment, null, 2));

  return {
    platform: deployment.platform,
    deploymentsFound: deployment.state.deployments?.length || 0
  };
}

/**
 * Restore deployment state
 */
async function restoreDeployment(inputPath) {
  const backupContent = await fs.readFile(inputPath, 'utf-8');
  const backup = JSON.parse(backupContent);

  console.log('\nNote: Deployment state restoration requires manual verification.');
  console.log('The following information was backed up:');
  
  if (backup.state.lastDeployment) {
    console.log(`  - Last deployment URL: ${backup.state.lastDeployment.url}`);
    console.log(`  - Deployment date: ${backup.state.lastDeployment.created}`);
  }

  if (backup.state.environmentVariables) {
    console.log(`  - Environment variables: ${backup.state.environmentVariables.length} vars`);
  }

  return {
    restored: true,
    requiresManualVerification: true
  };
}

/**
 * Check deployment status
 */
async function checkDeploymentStatus(verbose = false) {
  const status = {
    healthy: false,
    status: 'unknown',
    url: null,
    lastDeploy: null
  };

  // Try to get deployment URL from environment or Vercel
  let deploymentUrl = process.env.VERCEL_URL;
  
  if (!deploymentUrl) {
    try {
      const { stdout } = await execAsync('vercel ls --json', {
        cwd: process.cwd(),
        timeout: 5000
      });
      
      const deployments = JSON.parse(stdout);
      if (deployments && deployments.length > 0) {
        const latest = deployments[0];
        deploymentUrl = `https://${latest.url}`;
        status.lastDeploy = latest.created;
        status.status = latest.state;
      }
    } catch (error) {
      status.status = 'not-deployed';
      status.error = 'Could not fetch deployment info';
      return status;
    }
  }

  // Check health endpoint
  if (deploymentUrl) {
    status.url = deploymentUrl;
    
    try {
      const healthUrl = `${deploymentUrl}/api/health`;
      const response = await axios.get(healthUrl, { timeout: 5000 });
      
      if (response.status === 200) {
        status.healthy = true;
        status.status = 'running';
        
        if (verbose) {
          status.healthCheck = response.data;
        }
      }
    } catch (error) {
      status.healthy = false;
      status.status = 'unreachable';
      status.error = error.message;
    }
  }

  return status;
}

module.exports = {
  backupDeployment,
  restoreDeployment,
  checkDeploymentStatus
};
