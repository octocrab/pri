import * as fs from 'fs';
import * as pipe from '../node/pipe';
import { plugin } from './plugins';
import { walkProjectFiles } from './walk-project-files';

export const analyseProject = async () => {
  const files = await walkProjectFiles();

  // Clear analyseInfo
  plugin.analyseInfo = {};

  // Clear pipe
  pipe.clear();

  plugin.projectAnalyses.forEach(projectAnalyse => {
    const result = projectAnalyse(files, pipe.set);
    if (result && typeof result === 'object') {
      plugin.analyseInfo = {
        ...plugin.analyseInfo,
        ...result
      };
    }
  });

  return plugin.analyseInfo;
};

function hasFileWithoutExt(pathName: string) {
  const exts = ['.js', '.jsx', '.ts', '.tsx'];
  for (const ext of exts) {
    if (fs.existsSync(pathName + ext)) {
      return true;
    }
  }
  return false;
}
