const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const catalog = require('./catalog.json');
const examples = require('./examples.json');
const definitions = require('./definitions.json');
const xlsxCatalog = require('./xlsx-catalog.json');
const sectionCatalog = require('./section-catalog.json');
const compatibilityKeys = {
  turret: ['canAttack','canAttackFlyingUnits','canAttackLandUnits','canAttackUnderwaterUnits','canAttackNotTouchingWaterUnits','canOnlyAttackUnitsWithTags','canOnlyAttackUnitsWithoutTags','maxAttackRange','shootDelay','turretImageScale'],
  animation: ['body_[time]','arm#_[time]','leg#_[time]','effect_[time]']
};

const sections = ['core','graphics','attack','movement','ai','leg_','arm_','attachment_NAME','action_NAME','hiddenAction_NAME','effect_NAME','animation_NAME','turret_NAME','projectile_NAME','canBuild_NAME','placementRule_NAME','global_resource_NAME','resource_NAME','decal_NAME','comment_NAME','template_NAME'];
const keys = [
  ['name','Unit raw name','string'], ['mass','Collision weight','int'], ['radius','Selection radius','int'], ['price','Build price','price'], ['maxHp','Maximum health','int'], ['buildSpeed','Build time or speed','float / s'], ['class','Unit class','string'], ['techLevel','Technology level','int'], ['altNames','Alternative names','string(s)'], ['isBio','Biological unit','bool'], ['isBug','Bug unit','bool'], ['isBuilder','Can build','bool'], ['selfRegenRate','Passive repair rate','float'], ['maxShield','Maximum shield','int'], ['shieldRegen','Shield regeneration','float'], ['energyMax','Maximum energy','float'], ['energyRegen','Energy regeneration','float'], ['armour','Armor value','int'], ['displayText','Displayed unit name','LocaleString'], ['displayDescription','Displayed description','LocaleString'], ['copyFrom','Inherit from another unit/template','file(s)'], ['dont_load','Do not load this unit','bool'], ['overrideAndReplace','Replace vanilla unit names','string(s)'],
  ['image','Main unit image','file'], ['image_back','Back image','file'], ['image_shadow','Shadow image','file'], ['teamColorsUseHue','Use team color hue','bool'], ['scaleImagesTo','Image scale','float'], ['total_frames','Sprite frame count','int'],
  ['canAttack','Can attack','bool'], ['canAttackFlyingUnits','Can attack flying units','bool'], ['canAttackLandUnits','Can attack land units','bool'], ['canAttackUnderwaterUnits','Can attack underwater units','bool'], ['maxAttackRange','Maximum attack range','int'], ['shootDelay','Delay between shots','float'], ['turretSize','Turret size','float'],
  ['movementType','Movement type: LAND, AIR, WATER, HOVER, BUILDING','enum'], ['moveSpeed','Movement speed','float'], ['reverseSpeedPercentage','Reverse speed percentage','float'], ['maxTurnSpeed','Maximum turn speed','float'], ['turningSpeed','Turning speed','float'], ['moveAccelerationSpeed','Acceleration speed','float'], ['move decelerationSpeed','Deceleration speed','float'],
  ['buildSpeed','Builder speed','float'], ['canBuild','Units this unit can build','list'], ['spawnUnits','Spawn unit list','list'], ['spawnProjectiles','Spawn projectile list','list'], ['projectile','Projectile name','string'], ['directDamage','Direct damage','int'], ['areaDamage','Area damage','int'], ['areaRadius','Area damage radius','int'], ['speed','Projectile speed','float'], ['life','Projectile lifetime','int'], ['targetGround','Target ground','bool'], ['targetGround_includeTargetHeight','Include target height','bool'], ['image','Image or projectile sprite','file']
];
keys.push(['turretImageScale','Compatibility scale for turret images in some game versions','float']);
const extraKeys = [
  ['canShoot','Allow this turret to shoot','bool'], ['canAttackCondition','Condition required to attack','logicBoolean'], ['canNotBeDirectlyAttacked','Cannot be directly attacked','bool'], ['disablePassiveTargeting','Disable passive targeting','bool'], ['autoTargetingOnDeadTarget','Retarget after target death','bool'], ['clearTurretTargetAfterFiring','Clear target after firing','bool'], ['attackMovement','Attack while moving','enum'], ['maxAttackRange','Maximum attack range','float'], ['minAttackRange','Minimum attack range','float'], ['showInEditor','Show in editor','bool'], ['isBuilding','Treat unit as building','bool'], ['footprint','Building footprint','ints'], ['constructionFootprint','Construction footprint','ints'], ['displayFootprint','Displayed footprint','ints'], ['buildingSelectionOffset','Building selection offset','int'], ['buildingToFootprintOffsetX','Footprint X offset','float'], ['buildingToFootprintOffsetY','Footprint Y offset','float'], ['placeOnlyOnResPool','Place only on resource pool','bool'], ['selfBuildRate','Self-build rate','float'], ['ignoreInUnitCapCalculation','Ignore unit cap','bool'], ['onNewMapSpawn','Spawn rule on new map','string'], ['globalScale','Global unit scale','float'], ['drawLayer','Render layer','enum'], ['drawSize','Render size','float'], ['shadowOffsetX','Shadow X offset','float'], ['shadowOffsetY','Shadow Y offset','float'], ['imageScale','Image scale','float'], ['image_wreak','Wreck image','file'], ['image_back','Back image','file'], ['image_shadow','Shadow image','file'], ['teamColorsUseHue','Apply team color hue','bool'], ['lock_body_rotation_with_main_turret','Lock body rotation','bool'], ['total_frames','Sprite frame count','int'], ['frame_width','Sprite frame width','int'], ['frame_height','Sprite frame height','int'], ['animation_moving_start','Moving animation start frame','int'], ['animation_moving_end','Moving animation end frame','int'], ['animation_idle_start','Idle animation start frame','int'], ['animation_idle_end','Idle animation end frame','int'], ['reclaimPrice','Reclaim value','price'], ['canReclaimResources','Can reclaim resources','bool'], ['canRepairBuildings','Can repair buildings','bool'], ['canRepairUnits','Can repair units','bool'], ['canBuildUnits','Can build units','bool'], ['buildPriority','Build priority','int'], ['allowMultipleInQueue','Allow multiple queue entries','bool'], ['isLocked','Lock unit controls','bool'], ['disableAllUnitCollisions','Disable unit collisions','bool'], ['dieOnZeroEnergy','Die at zero energy','bool'], ['dieOnAttack','Die when attacking','bool'], ['dieOnConstruct','Die on construct','bool'], ['autoRepair','Auto repair','bool'], ['effectOnDeath','Effect on death','string'], ['effectOnDeathIfUnbuilt','Effect on death if unbuilt','string'], ['explodeOnDeath','Explode on death','bool'], ['soundOnDeath','Death sound','file'], ['tags','Unit tags','string(s)'], ['showOnMinimap','Show on minimap','bool'], ['showOnMinimapToEnemies','Show to enemies on minimap','bool'], ['disableUse','Disable unit use','bool'], ['cannotPlaceMessage','Cannot-place message','string'], ['copyFromSection','Copy from section','string'], ['onCreateSpawnUnits','Units spawned on create','list'], ['onDeathSpawnUnits','Units spawned on death','list'], ['spawnEffects','Effects spawned on create','list'], ['team','Team assignment','int'], ['transportSlotsNeeded','Transport slots needed','int'], ['canTransportUnits','Can transport units','bool'], ['transportUnitsRequireTag','Transport tag requirement','string'], ['transportUnitsRequireMovementType','Transport movement requirement','enum'], ['transportUnitsCanUnloadAtAnyTime','Unload at any time','bool'], ['transportUnitsKeepWaypoints','Keep transported waypoints','bool'], ['maxTransportingUnits','Maximum transported units','int'], ['transportUnitsBlockOtherTransports','Block other transports','bool'], ['unloadInCurrentPosition','Unload in current position','bool'], ['exit_x','Transport exit X','float'], ['exit_y','Transport exit Y','float'], ['exit_heightOffset','Transport exit height','float'], ['exit_dirOffset','Transport exit direction','float'], ['addResources','Resources added','price'], ['generation_resources','Generated resources','price'], ['generation_credits','Generated credits','int'], ['generation_delay','Generation delay','int'], ['resourceRate','Resource rate','float'], ['resourceMaxConcurrentUsers','Resource user limit','int'], ['resourceOverrideAmount','Resource amount','int'], ['resourceRegenDelay','Resource regeneration delay','int'], ['logicBoolean','Logic boolean expression','expression'], ['alsoTriggerAction','Trigger another action','string'], ['autoTrigger','Automatically trigger action','bool'], ['autoTriggerOnEvent','Trigger on event','enum'], ['autoTriggerCheckRate','Automatic check rate','float'], ['autoTriggerCooldownTime','Action cooldown','float'], ['action','Action name','string'], ['text','Action display text','string'], ['isLocked','Lock action','bool'], ['buildUnit','Unit built by action','string'], ['fireTurretX','Turret fired by action','string'], ['playSound','Sound played by action','file'], ['spawnEffects','Effects created by action','list'], ['deleteSelf','Delete unit action','bool'], ['teleportTo','Teleport destination','string'], ['setBodyRotation','Set body rotation','float'], ['setHeight','Set unit height','float'], ['setEnergy','Set energy','float'], ['setShield','Set shield','float'], ['setCustomTarget1','Set custom target','string'], ['setUnitMemory','Set unit memory','expression'], ['memory','Memory value','expression'], ['x','X coordinate','float'], ['y','Y coordinate','float'], ['offsetX','X offset','float'], ['offsetY','Y offset','float'], ['offsetHeight','Height offset','float'], ['offsetDir','Direction offset','float'], ['teamColor','Team color','color'], ['color','Color value','color'], ['alpha','Opacity','int'], ['blendIn','Effect blend-in time','float'], ['blendOut','Effect blend-out time','float'], ['life','Effect lifetime','float'], ['priority','Effect priority','int'], ['attachedTo','Attach effect to unit','string'], ['image','Image file','file'], ['frameIndex','Image frame index','int'], ['frameIndex_start','Animation start frame','int'], ['frameIndex_end','Animation end frame','int'], ['animation','Animation name','string'], ['onActions','Actions triggered by animation','list'], ['start','Animation start time','float'], ['end','Animation end time','float'], ['speed','Animation speed','float'], ['direction_starting','Animation direction start','float'], ['direction_strideX','Animation X stride','float'], ['direction_strideY','Animation Y stride','float'], ['direction_units','Animation direction units','int']
];
keys.push(...extraKeys);
for (const key of catalog) {
  if (!keys.some(([name]) => name === key)) keys.push([key, 'Rusted Warfare unit-mod property from the 1.16 reference', 'see reference']);
}
for (const [key, info] of Object.entries(xlsxCatalog)) {
  const existing = keys.findIndex(([name]) => name === key);
  const description = info.description || 'Rusted Warfare unit-mod property';
  const type = info.type || 'see reference';
  if (existing >= 0) keys[existing] = [key, description, type];
  else keys.push([key, description, type]);
}
const values = {
  movementType: ['NONE','LAND','AIR','WATER','HOVER','BUILDING','OVER_CLIFF','OVER_CLIFF_WATER'],
  canAttack: ['true','false'], canAttackFlyingUnits: ['true','false'], canAttackLandUnits: ['true','false'], canAttackUnderwaterUnits: ['true','false'],
  isBio: ['true','false'], isBug: ['true','false'], isBuilder: ['true','false'], dont_load: ['true','false'], targetGround: ['true','false'],
  builtFrom_1_name: ['builder','combatEngineer','experimentalSpider','landFactory','airFactory','fabricator'],
  shoot_flame: ['small','medium','large','smoke','CUSTOM:lightFade','CUSTOM:pop*5'],
  shoot_sound: ['firing3','tank_firing','missile_fire','plasma_fire','cannon_firing','laser_fire'],
  drawType: ['0','1','2'], attackMovement: ['stopping','moving','onlyMoving'], targetGround_includeTargetHeight: ['true','false'],
  image_shadow: ['AUTO','AUTO_ANIMATED','NONE'], image_end_shadow: ['AUTO','AUTO_ANIMATED','NONE'], image_foot_shadow: ['AUTO','AUTO_ANIMATED','NONE'], imageShadow: ['AUTO','NONE'],
  image_wreak: ['NONE'], image_middle: ['NONE'], teamColoringMode: ['pureGreen','hueAdd','hueShift','disabled'],
  drawLayer: ['wreaks','underwater','bottom','ground','ground2','experimentals','air','top'],
  stripIndex: ['effects','explode_big','light_50','flame','effects2','projectiles','projectiles2','explode_bits'],
  movementEffect: ['smoke','CUSTOM:fastDust*2','CUSTOM:pop*5'], movementEffectReverse: ['smoke','CUSTOM:fastDust*2','CUSTOM:pop*5']
};

function projectileImageMarkdown(context) {
  const dir = context.extensionPath;
  const file = name => 'file://' + path.join(dir, 'assets', name).replace(/\\/g, '/');
  return '\n\nProjectile sprite sheets from the reference:\n\n' +
    '<img src="' + file('projectiles.png') + '" width="300">\n\n' +
    '<img src="' + file('projectiles_large.png') + '" width="300">\n\n' +
    '<img src="' + file('projectiles2.png') + '" width="300">';
}

function exampleFor(key) {
  if (xlsxCatalog[key] && xlsxCatalog[key].example) return xlsxCatalog[key].example;
  if (examples[key]) return examples[key];
  if (/^builtFrom_\d+_name$/.test(key)) return 'builtFrom_1_name: landFactory, airFactory';
  if (key === 'shoot_flame') return 'shoot_flame: smoke, CUSTOM:lightFade, CUSTOM:pop*5';
  if (key === 'shoot_sound') return 'shoot_sound: tank_firing | shoot_sound: missile.wav';
  if (key === 'drawType') return 'drawType: 1';
  return undefined;
}

function definitionFor(key, fallback) {
  if (xlsxCatalog[key] && xlsxCatalog[key].description) return xlsxCatalog[key].description;
  if (/^builtFrom_\d+_name$/.test(key) && xlsxCatalog['builtFrom_{NUM}_name']) return xlsxCatalog['builtFrom_{NUM}_name'].description;
  return definitions[key] || definitions[key.replace(/_\d+_/, '_{NUM}_')] || fallback;
}

function categoryFromName(name) {
  const value = name.toLowerCase();
  if (value.startsWith('hiddenaction_')) return 'hiddenAction';
  if (value.startsWith('action_')) return 'action';
  if (value.startsWith('turret_')) return 'turret';
  if (value.startsWith('projectile_')) return 'projectile';
  if (value.startsWith('canbuild_')) return 'canBuild';
  if (value.startsWith('global_resource_')) return 'global_resource';
  if (value.startsWith('placementrule_')) return 'placementRule';
  if (value.startsWith('resource_')) return 'resource';
  if (value.startsWith('animation_')) return 'animation';
  if (value.startsWith('attachment_')) return 'attachment';
  if (value.startsWith('effect_')) return 'effect';
  if (value.startsWith('decal_')) return 'decal';
  if (value.startsWith('template_')) return 'template';
  if (value.startsWith('leg_')) return 'leg';
  if (value.startsWith('arm_')) return 'arm';
  return name;
}

function sectionCategory(document, position) {
  for (let lineNumber = position.line; lineNumber >= 0; lineNumber--) {
    const match = document.lineAt(lineNumber).text.match(/^\s*\[([^\]]+)\]/);
    if (!match) continue;
    return categoryFromName(match[1]);
  }
  return null;
}

function keyMatchesCatalog(key, allowed, category) {
  if (allowed.includes(key)) return true;
  if (category === 'animation' && (/^body_(?:\d+(?:\.\d+)?)s$/.test(key) || /^(?:arm|leg)\d+_(?:\d+(?:\.\d+)?)s$/.test(key) || /^effect_(?:\d+(?:\.\d+)?)s$/.test(key))) return true;
  return allowed.some(pattern => {
    const escaped = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\{NUM\\\}/g, '\\d+')
      .replace(/\\\{LANG\\\}/g, '[A-Za-z]{2,}')
      .replace(/\\#/g, '\\d+');
    return new RegExp('^' + escaped + '$').test(key);
  });
}

const requiredKeys = {
  core: ['name', 'mass', 'radius', 'price', 'maxHp'],
  graphics: ['image'],
  attack: ['canAttack', 'canAttackFlyingUnits', 'canAttackLandUnits', 'canAttackUnderwaterUnits'],
  movement: ['movementType']
};

function validValueForType(type, value) {
  const normalized = String(type || '').toLowerCase();
  const v = value.trim();
  if (!v) return true;
  if (normalized.includes('bool')) return /^(true|false)$/i.test(v);
  if (normalized === 'int' || normalized === 'integer') return /^[-+]?\d+$/.test(v);
  if (normalized.includes('ints')) return /^[-+]?\d+(?:\s*,\s*[-+]?\d+)*$/.test(v);
  if (normalized.includes('float') || normalized.includes('number')) return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:s|%)?$/.test(v);
  if (normalized === 'color') return /^#[0-9a-f]{6,8}$/i.test(v);
  return true;
}

function isLogicExpression(key, value) {
  const v = value.trim();
  return /^(if\s+|unless\s+|self\.|this\.|parent\.|memory\.)/.test(v)
    || /(?:==|!=|<=|>=|<|>)/.test(v)
    || /^(?:true|false)\s*(?:$|#)/i.test(v)
    || /^(?:autoTrigger|isVisible|isLocked|canAttack|canAttack[A-Z]|canOnlyAttack)/.test(key);
}

function refreshDiagnostics(document, collection) {
  if (document.languageId !== 'rusted-warfare-ini') return;
  const diagnostics = [];
  let currentSection = null;
  let currentSectionLine = 0;
  const sectionData = new Map();
  const sectionNames = new Set();
  const references = [];
  const mediaRefs = [];
  for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
    const line = document.lineAt(lineNumber).text;
    const sectionMatch = line.match(/^\s*\[([^\]]+)\]/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      sectionNames.add(currentSection.toLowerCase());
      currentSectionLine = lineNumber;
      sectionData.set(currentSectionLine, { name: currentSection, category: categoryFromName(currentSection), line: currentSectionLine, keys: new Set(), values: new Map() });
      continue;
    }
    const keyMatch = line.match(/^\s*([A-Za-z_@][A-Za-z0-9_@-]*)\s*:/);
    if (!keyMatch || !currentSection || line.trimStart().startsWith('#')) continue;
    const category = categoryFromName(currentSection);
    const data = sectionData.get(currentSectionLine);
    const rawValue = line.slice(keyMatch[0].length).split('#')[0].trim();
    if (data) {
      data.keys.add(keyMatch[1]);
      data.values.set(keyMatch[1], rawValue);
    }
    references.push({ key: keyMatch[1], value: rawValue, lineNumber, line });
    if (/^(?:image(?:_|$)|icon_|beamImage$|chargeEffectImage$)/.test(keyMatch[1]) || /^(?:shoot_sound|soundOn|alsoPlaySound|playSound)/.test(keyMatch[1])) {
      mediaRefs.push({ key: keyMatch[1], value: rawValue, lineNumber, line });
    }
    if (keyMatch[1] === 'turretImageScale') {
      const start = line.indexOf(keyMatch[1]);
      const range = new vscode.Range(lineNumber, start, lineNumber, start + keyMatch[1].length);
      diagnostics.push(new vscode.Diagnostic(range, 'Compatibility key. Use `scaleTurretImagesTo` under [graphics] for the documented 1.16 syntax.', vscode.DiagnosticSeverity.Warning));
      continue;
    }
    const info = xlsxCatalog[keyMatch[1]];
    if (info && info.type && !isLogicExpression(keyMatch[1], rawValue) && !validValueForType(info.type, rawValue)) {
      const start = line.indexOf(keyMatch[1]);
      const range = new vscode.Range(lineNumber, start, lineNumber, line.length);
      diagnostics.push(new vscode.Diagnostic(range, 'Value does not match the documented type `' + info.type + '` for `' + keyMatch[1] + '`.', vscode.DiagnosticSeverity.Warning));
    }
    const allowed = sectionCatalog[category];
    if (!allowed || keyMatchesCatalog(keyMatch[1], [...allowed, ...(sectionCatalog._universal || []), ...(compatibilityKeys[category] || [])], category)) continue;
    const start = line.indexOf(keyMatch[1]);
    const range = new vscode.Range(lineNumber, start, lineNumber, start + keyMatch[1].length);
    diagnostics.push(new vscode.Diagnostic(range, '`' + keyMatch[1] + '` is not documented for [' + currentSection + ']. Check the section or move this key to the correct section.', vscode.DiagnosticSeverity.Warning));
  }
  for (const data of sectionData.values()) {
    let required = requiredKeys[data.category];
    if (data.category === 'attack' && data.values.get('canAttack') === 'false') required = ['canAttack'];
    if (!required || data.keys.has('copyFrom') || data.keys.has('copyFromSection')) continue;
    for (const key of required) {
      if (data.keys.has(key)) continue;
      diagnostics.push(new vscode.Diagnostic(new vscode.Range(data.line || 0, 0, data.line || 0, 1), '[' + data.name + '] is missing required key `' + key + '`.', vscode.DiagnosticSeverity.Warning));
    }
  }
  for (const ref of references) {
    const value = ref.value.replace(/^['"]|['"]$/g, '');
    if (!value || /^(?:true|false|NONE|AUTO|AUTO_ANIMATED)$/i.test(value)) continue;
    let target;
    if (ref.key === 'projectile') target = 'projectile_' + value.split(/[,(\s*]/)[0];
    else if (/animation/i.test(ref.key)) target = 'animation_' + value.split(/[,(\s*]/)[0];
    else if (/effect/i.test(ref.key) && /^CUSTOM:/.test(value)) target = 'effect_' + value.slice(7).split(/[*(,\s]/)[0];
    if (target && !sectionNames.has(target.toLowerCase())) {
      const start = ref.line.indexOf(ref.key);
      diagnostics.push(new vscode.Diagnostic(new vscode.Range(ref.lineNumber, start, ref.lineNumber, ref.line.length), 'Referenced section [' + target + '] was not found in this file.', vscode.DiagnosticSeverity.Warning));
    }
  }
  for (const ref of mediaRefs) {
    const valuesToCheck = ref.value.split(',').map(value => value.trim()).filter(Boolean);
    for (const media of valuesToCheck) {
      if (/^(?:true|false|NONE|AUTO|AUTO_ANIMATED|[A-Za-z0-9_-]+)$/i.test(media) && !/[.\\/]/.test(media)) continue;
      const clean = media.replace(/^['"]|['"]$/g, '').replace(/^ROOT:/, '');
      if (!/\.(?:png|jpe?g|webp|gif|ogg|wav)$/i.test(clean)) continue;
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
      const baseDir = clean !== media.replace(/^['"]|['"]$/g, '') || media.startsWith('ROOT:')
        ? (workspaceFolder ? workspaceFolder.uri.fsPath : path.dirname(document.uri.fsPath))
        : path.dirname(document.uri.fsPath);
      const candidate = path.isAbsolute(clean) ? clean : path.join(baseDir, clean);
      if (!fs.existsSync(candidate)) {
        const start = ref.line.indexOf(media);
        diagnostics.push(new vscode.Diagnostic(new vscode.Range(ref.lineNumber, Math.max(0, start), ref.lineNumber, Math.max(0, start) + media.length), 'Referenced file was not found: ' + media, vscode.DiagnosticSeverity.Warning));
      }
    }
  }
  collection.set(document.uri, diagnostics);
}

function previewUnitStructure(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'rusted-warfare-ini') {
    vscode.window.showInformationMessage('Open a Rusted Warfare .ini file first.');
    return;
  }
  const sections = [];
  let current = null;
  for (let i = 0; i < editor.document.lineCount; i++) {
    const line = editor.document.lineAt(i).text;
    const match = line.match(/^\s*\[([^\]]+)\]/);
    if (match) { current = { name: match[1], keys: [] }; sections.push(current); continue; }
    const key = line.match(/^\s*([A-Za-z_@][A-Za-z0-9_@-]*)\s*:/);
    if (key && current) current.keys.push(key[1]);
  }
  const panel = vscode.window.createWebviewPanel('rustedWarfareUnitPreview', 'Rusted Warfare Unit Structure', vscode.ViewColumn.Beside, { enableScripts: false });
  const cards = sections.map(section => '<section><h2>[' + section.name + ']</h2><p>' + section.keys.length + ' keys</p><code>' + section.keys.join('<br>') + '</code></section>').join('');
  panel.webview.html = '<!doctype html><html><head><style>body{font-family:system-ui;padding:16px;background:#1e1e1e;color:#ddd}section{border:1px solid #555;border-radius:8px;padding:12px;margin:10px 0}h2{margin:0 0 6px;color:#8bd5ff}code{line-height:1.6;color:#ddd}</style></head><body><h1>Unit Structure</h1>' + cards + '</body></html>';
}

function activate(context) {
  const diagnostics = vscode.languages.createDiagnosticCollection('rusted-warfare-mod-tools');
  context.subscriptions.push(diagnostics);
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => refreshDiagnostics(document, diagnostics)));
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => refreshDiagnostics(event.document, diagnostics)));
  context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(document => diagnostics.delete(document.uri)));
  for (const document of vscode.workspace.textDocuments) refreshDiagnostics(document, diagnostics);
  context.subscriptions.push(vscode.commands.registerCommand('rustedWarfare.previewUnitStructure', () => previewUnitStructure(context)));
  const provider = vscode.languages.registerCompletionItemProvider('rusted-warfare-ini', {
    async provideCompletionItems(document, position) {
      const line = document.lineAt(position).text;
      const before = line.slice(0, position.character);
      const items = [];
      if (/^\s*\[/.test(line) || (before.trim() === '')) {
        const typedSection = before.match(/\[([A-Za-z_]*)$/);
        const hasOpeningBracket = Boolean(typedSection);
        const typed = typedSection ? typedSection[1] : '';
        const hasClosingBracket = line[position.character] === ']';
        const replaceStart = hasOpeningBracket ? position.translate(0, -typed.length) : position;
        for (const section of sections) {
          const named = section.endsWith('_NAME');
          const sectionName = named ? section.slice(0, -5) : section;
          const close = hasClosingBracket ? '' : ']';
          const i = new vscode.CompletionItem(hasOpeningBracket ? sectionName + (named ? '${name}' : '') + close : '[' + sectionName + (named ? '${name}' : '') + ']', vscode.CompletionItemKind.Module);
          i.filterText = sectionName;
          i.range = new vscode.Range(replaceStart, position);
          i.insertText = named
            ? new vscode.SnippetString(sectionName + '${1:name}' + close)
            : (hasOpeningBracket ? sectionName + close : '[' + sectionName + ']');
          i.detail = named ? 'Rusted Warfare named section' : 'Rusted Warfare section';
          items.push(i);
        }
      }
      if (/^\s*[A-Za-z_][A-Za-z0-9_]*\s*$/.test(before)) {
        const category = sectionCategory(document, position);
        const allowed = category && sectionCatalog[category]
          ? new Set([...sectionCatalog[category], ...(sectionCatalog._universal || []), ...(compatibilityKeys[category] || [])])
          : null;
        const contextKeys = allowed ? keys.filter(([key]) => allowed.has(key)) : keys;
        for (const [key, detail, type] of contextKeys) {
            const i = new vscode.CompletionItem(key, vscode.CompletionItemKind.Property);
            i.insertText = key + ': ';
            i.detail = type;
            const description = definitionFor(key, detail);
            const example = exampleFor(key);
            i.documentation = example ? description + '\n\nExample: `' + example + '`' : description;
            items.push(i);
          }
      }
      const keyMatch = before.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*([^:]*)$/);
      if (keyMatch) {
        const choices = values[keyMatch[1]] || (keyMatch[1].startsWith('builtFrom_') ? values.builtFrom_1_name : undefined);
        if (choices) for (const value of choices) {
          const i = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
          i.insertText = value;
          i.detail = 'Known Rusted Warfare value';
          if (keyMatch[1] === 'drawType') i.documentation = new vscode.MarkdownString('Built-in projectile sprite sheet: `' + value + '`' + (value === '0' ? ' = projectiles.png' : value === '1' ? ' = projectiles_large.png' : ' = projectiles2.png') + projectileImageMarkdown(context));
          items.push(i);
        }
        if (/^image(?:_|$)/.test(keyMatch[1])) {
          const imageFiles = await vscode.workspace.findFiles('**/*.{png,jpg,jpeg,webp}', '**/{node_modules,.git}/**', 100);
          for (const uri of imageFiles) {
            const relative = vscode.workspace.asRelativePath(uri, false).replace(/\\/g, '/');
            const i = new vscode.CompletionItem(relative, vscode.CompletionItemKind.File);
            i.insertText = relative;
            i.detail = 'Unit image';
            const imageDoc = new vscode.MarkdownString('<img src="' + uri.toString() + '" width="240">');
            imageDoc.supportHtml = true;
            i.documentation = imageDoc;
            items.push(i);
          }
        }
      }
      return items;
    }
  }, ':', ' ', '[', '_');
  context.subscriptions.push(provider);
  const hover = vscode.languages.registerHoverProvider('rusted-warfare-ini', {
    provideHover(document, position) {
      const imageLine = document.lineAt(position.line).text.match(/^\s*(image(?:_[A-Za-z0-9_]+)?)\s*:\s*(\S+)/);
      if (imageLine && position.character >= document.lineAt(position.line).text.indexOf(imageLine[2])) {
        const rawPath = imageLine[2].replace(/^['"]|['"]$/g, '');
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        let imagePath = rawPath;
        if (rawPath.startsWith('ROOT:')) imagePath = rawPath.slice(5);
        const imageUri = vscode.Uri.file(path.isAbsolute(imagePath) ? imagePath : path.join(path.dirname(document.uri.fsPath), imagePath));
        const md = new vscode.MarkdownString('**' + imageLine[1] + ':** `' + rawPath + '`\n\n<img src="' + imageUri.toString() + '" width="300">');
        md.isTrusted = true;
        md.supportHtml = true;
        return new vscode.Hover(md);
      }
      const word = document.getText(document.getWordRangeAtPosition(position, /[A-Za-z_][A-Za-z0-9_]*/));
      const found = keys.find(([key]) => key === word);
      if (!found) return undefined;
      const extra = found[0] === 'drawType' ? projectileImageMarkdown(context) : '';
      const example = exampleFor(found[0]);
      const description = definitionFor(found[0], found[1]);
      return new vscode.Hover('**' + found[0] + ':** ' + description + '\n\nType: `' + found[2] + '`' + (example ? '\n\nExample: `' + example + '`' : '') + extra);
    }
  });
  context.subscriptions.push(hover);
}
exports.activate = activate;
exports.deactivate = () => {};
