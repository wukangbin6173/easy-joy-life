const DEFAULT_AVATAR = '/images/default-avatar.png';
const config = require('./config.js');
const UPLOAD_ASSET_BASE_URL = 'https://www.quexitai.com';

function getAssetBaseUrl() {
  try {
    const currentConfig = config.getCurrentConfig && config.getCurrentConfig();
    return (currentConfig && (currentConfig.assetBaseUrl || currentConfig.baseUrl)) || 'https://www.quexitai.com';
  } catch (e) {
    return 'https://www.quexitai.com';
  }
}

function buildUploadFileUrl(dateDir, fileName, suffix = '') {
  const baseUrl = UPLOAD_ASSET_BASE_URL.replace(/\/+$/, '');
  return `${baseUrl}/api/upload/files/${dateDir}/${fileName}${suffix || ''}`;
}

function normalizeAvatarUrl(value, options = {}) {
  const url = String(value || '').trim();
  if (!url || url === DEFAULT_AVATAR) return '';

  if (/^(wxfile|file):\/\//i.test(url) || /^http:\/\/tmp\//i.test(url)) {
    return options.allowLocal ? url : '';
  }

  const uploadMatch = url.match(/^(?:https?:\/\/[^/]+)?\/api\/upload\/files\/(\d{8})\/([^?#]+)(.*)$/i);
  if (uploadMatch) {
    return buildUploadFileUrl(uploadMatch[1], uploadMatch[2], uploadMatch[3]);
  }

  const legacyMatch = url.match(/^(?:https?:\/\/(?:www\.)?quexitai\.com)?\/uploads\/(\d{8})\/([^?#]+)(.*)$/i);
  if (legacyMatch) {
    return buildUploadFileUrl(legacyMatch[1], legacyMatch[2], legacyMatch[3]);
  }

  const httpsUrl = /^http:\/\//i.test(url) ? url.replace(/^http:\/\//i, 'https://') : url;
  return httpsUrl;
}

function isWechatQlogo(url) {
  return /^https?:\/\/[^/]*(thirdwx\.qlogo\.cn|wx\.qlogo\.cn|qlogo\.cn)\//i.test(String(url || ''));
}

function isPlaceholderWechatProfile(source, url) {
  const nickname = String((source && (source.nickname || source.nickName)) || '').trim();
  return isWechatQlogo(url) && (!nickname || nickname.indexOf('微信用户') === 0);
}

function resolveAvatar(...args) {
  let options = {};
  if (args.length && args[args.length - 1] && args[args.length - 1].__avatarOptions) {
    options = args.pop();
  }

  for (const source of args) {
    if (!source) continue;
    const avatar = normalizeAvatarUrl(
      source.wechatAvatar ||
      source.wxAvatar ||
      source.avatarUrl ||
      source.headImgUrl ||
      source.headimgurl ||
      source.avatar,
      options
    );
    if (avatar && isPlaceholderWechatProfile(source, avatar)) continue;
    if (avatar) return avatar;
  }

  return '';
}

function avatarOptions(options) {
  return { ...options, __avatarOptions: true };
}

function isDefaultNickname(value) {
  const text = String(value || '').trim();
  return !text || text.indexOf('微信用户') === 0;
}

function resolveNickname(...sources) {
  for (const source of sources) {
    const nickname = source && (source.nickname || source.nickName);
    if (!isDefaultNickname(nickname)) return String(nickname).trim();
  }

  return '微信用户';
}

function getAvatarText(nickname) {
  const text = String(nickname || '').trim();
  return isDefaultNickname(text) ? '雀' : text.slice(0, 1);
}

function isTempAvatar(url) {
  return /^(wxfile|file):\/\//i.test(String(url || '')) || /^http:\/\/tmp\//i.test(String(url || ''));
}

function withCacheBuster(url, version) {
  const normalized = normalizeAvatarUrl(url);
  if (!normalized || isTempAvatar(normalized) || !version) return normalized;
  const joiner = normalized.includes('?') ? '&' : '?';
  return `${normalized}${joiner}v=${encodeURIComponent(version)}`;
}

module.exports = {
  DEFAULT_AVATAR,
  avatarOptions,
  getAvatarText,
  isPlaceholderWechatProfile,
  isDefaultNickname,
  isTempAvatar,
  isWechatQlogo,
  normalizeAvatarUrl,
  resolveAvatar,
  resolveNickname,
  withCacheBuster
};
