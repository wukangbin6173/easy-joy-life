// 银行配置信息
const BANK_CONFIG = {
  'icbc': { name: '工商银行', color: '#C8161D', logo: '/images/banks/icbc.png' },
  'ccb': { name: '建设银行', color: '#003D7C', logo: '/images/banks/ccb.png' },
  'abc': { name: '农业银行', color: '#00843D', logo: '/images/banks/abc.png' },
  'boc': { name: '中国银行', color: '#B8292F', logo: '/images/banks/boc.png' },
  'cmb': { name: '招商银行', color: '#D32F2F', logo: '/images/banks/cmb.png' },
  'comm': { name: '交通银行', color: '#0066B3', logo: '/images/banks/comm.png' },
  'psbc': { name: '邮储银行', color: '#00853F', logo: '/images/banks/psbc.png' },
  'cib': { name: '兴业银行', color: '#003D7C', logo: '/images/banks/cib.png' },
  'spdb': { name: '浦发银行', color: '#003D7C', logo: '/images/banks/spdb.png' },
  'citic': { name: '中信银行', color: '#D32F2F', logo: '/images/banks/citic.png' }
};

// 根据卡号前缀识别银行
function getBankByCardNo(cardNo) {
  const prefix = cardNo.substring(0, 6);
  
  // 工商银行
  if (['622202', '622200', '621226', '621225', '621558', '621559', '621722', '621723', '620058', '620059'].includes(prefix)) {
    return 'icbc';
  }
  // 建设银行
  if (['436742', '622280', '621080', '621081', '620060', '620061'].includes(prefix)) {
    return 'ccb';
  }
  // 农业银行
  if (['622848', '622849', '621336', '621619', '620059', '620062'].includes(prefix)) {
    return 'abc';
  }
  // 中国银行
  if (['621660', '621661', '621662', '621663', '621665', '621667', '621668', '621669', '456351', '601382', '620061', '621256', '621212', '621283', '620062'].includes(prefix)) {
    return 'boc';
  }
  // 招商银行
  if (['621286', '621483', '621485', '621486', '621299', '621498', '622580', '622588', '622598', '622609', '621439', '621478', '621479', '621480', '621481', '621482', '621487', '621488', '621489', '620520'].includes(prefix)) {
    return 'cmb';
  }
  // 交通银行
  if (['622260', '622261', '621002', '621069', '620013', '620014'].includes(prefix)) {
    return 'comm';
  }
  // 邮储银行
  if (['622188', '621096', '621098', '620062', '621285', '621798', '621799', '621797', '620529', '621622', '621599', '621674', '623218', '623219'].includes(prefix)) {
    return 'psbc';
  }
  // 兴业银行
  if (['622909', '622908', '622906', '621439', '621478', '621479', '621480', '621481', '621482', '621487', '621488', '621489', '620520'].includes(prefix)) {
    return 'cib';
  }
  // 浦发银行
  if (['622516', '622517', '622518', '622521', '622522', '622523', '621352', '621793', '621795', '621796', '621351', '621390', '621792', '621791', '620530'].includes(prefix)) {
    return 'spdb';
  }
  // 中信银行
  if (['622690', '622691', '622692', '622696', '622698', '622998', '622999', '433670', '433680', '442729', '442730', '620082', '621771', '621767', '621768', '621770', '621772', '621773'].includes(prefix)) {
    return 'citic';
  }
  
  return null;
}

module.exports = {
  BANK_CONFIG,
  getBankByCardNo
};
