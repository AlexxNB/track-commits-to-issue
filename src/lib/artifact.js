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
    try{
        await artifactClient.uploadArtifact(NAME, [FILE], '.', options);
    }catch(err){
        console.log('Error while saving artifact!')
    }
}

export async function loadArtifact(){
    console.log('Loading artifact with last timestamp...');
    try{
        await artifactClient.downloadArtifact(NAME, undefined, options)
    }catch(err){
        console.log('No artifacts found...')
    }
}