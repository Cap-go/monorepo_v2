// scripts/utils.ts
export const versionPureToCode = (versionPure: string): number => {
  let versionCode = Number(
    versionPure
      .split('.')
      .map(v => (v.length === 1 ? `0${v}` : v))
      .join('')
  );
  return versionCode;
};

export const versionBetaToCode = (versionBeta: string): number => {
  if (!versionBeta) {
    return 999;
  }
  let versionCodeBeta = Number(versionBeta.split('.')[1] || 0);
  if (versionCodeBeta > 100) {
    throw new Error('versionCodeBeta should be less than 100');
  }
  if (versionBeta.startsWith('rc.')) {
    versionCodeBeta = 800 + versionCodeBeta;
  } else if (versionBeta.startsWith('beta.')) {
    versionCodeBeta = 700 + versionCodeBeta;
  } else if (versionBeta.startsWith('alpha.')) {
    versionCodeBeta = 600 + versionCodeBeta;
  }
  return versionCodeBeta;
};

export const versionCodeToCodeBeta = (versionCode: number, versionCodeBeta: number): number => {
  return versionCode * 1000 + versionCodeBeta;
};
