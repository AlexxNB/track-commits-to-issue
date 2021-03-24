import artifact from '@actions/artifact';
const artifactClient = artifact.create();

const NAME = 'last-check-atf';
const FILE = '.last_check';

const options = {
    continueOnError: true,
    createArtifactFolder: false
}

export async function saveArtifact(){
    console.log('Saving artifact with current timestamp...');
    await artifactClient.uploadArtifact(NAME, [FILE], '.', options);
}

export async function loadArtifact(){
    console.log('Loading artifact with last timestamp...');
    await artifactClient.downloadArtifact(NAME, undefined, options)
}