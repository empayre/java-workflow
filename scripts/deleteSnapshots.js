module.exports = async ({
    github,
    core
}) => {
    const packageType = 'maven';
    const packageName = process.env.PACKAGE_NAME;
    const owner = process.env.REPOSITORY_OWNER;
    const branchSuffix = process.env.BRANCH_SUFFIX;

    if (!branchSuffix) {
      core.info('BRANCH_SUFFIX is empty. Skipping deletion.');
      return;
    }

    try {
        const versions = await github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
            package_type: packageType,
            package_name: packageName,
            org: owner,
        });

        const toDelete = versions.data.filter(v => v.name.includes(branchSuffix));

        if (toDelete.length === 0) {
            core.info(`No versions found with suffix '${branchSuffix}'. Skipping.`);
        } else if (toDelete.length === versions.data.length) {
            core.info(`Only '${branchSuffix}' versions found. Deleting entire package '${packageName}'`);
            await github.rest.packages.deletePackageForOrg({
                package_type: packageType,
                package_name: packageName,
                org: owner,
            });
        } else {
            for (const version of toDelete) {
                core.info(`Deleting ${packageName} - ${version.name}`);
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
