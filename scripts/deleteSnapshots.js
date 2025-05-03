module.exports = async ({ github, core }) => {
  const packageType = 'maven';
  const packageName = process.env.PACKAGE_NAME;
  const owner = process.env.REPOSITORY_OWNER;
  const branchSuffix = process.env.BRANCH_SUFFIX;
  const currentBranch = process.env.CURRENT_BRANCH;

  const isMain = currentBranch === 'main' || currentBranch === 'master';

  try {
    const versions = await github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
      package_type: packageType,
      package_name: packageName,
      org: owner,
    });

    let toDelete = [];

    if (isMain) {
      core.info(`Current branch is '${currentBranch}'. Will delete all non-main versions.`);
      toDelete = versions.data.filter(v => v.name.includes('-') && v.name.split('-').length > 2);
    } else if (branchSuffix) {
      core.info(`Branch suffix is '${branchSuffix}'. Will delete only matching versions.`);
      toDelete = versions.data.filter(v => v.name.includes(branchSuffix));
    } else {
      core.info('BRANCH_SUFFIX is empty and not on main branch. Skipping deletion.');
      return;
    }

    if (toDelete.length === 0) {
      core.info('No matching versions found. Skipping deletion.');
    } else if (toDelete.length === versions.data.length) {
      core.info(`All versions match. Deleting entire package '${packageName}'`);
      await github.rest.packages.deletePackageForOrg({
        package_type: packageType,
        package_name: packageName,
        org: owner,
      });
    } else {
      for (const version of toDelete) {
        core.info(`Deleting version: ${version.name}`);
        await github.rest.packages.deletePackageVersionForOrg({
          package_type: packageType,
          package_name: packageName,
          org: owner,
          package_version_id: version.id,
        });
      }
    }
  } catch (error) {
    if (error.status === 404) {
      core.info(`Package '${packageName}' not found in organization '${owner}'. Skipping deletion.`);
    } else {
      throw error;
    }
  }
};
