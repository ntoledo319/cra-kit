const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const file=process.env.CHECKER_HTML||path.join(__dirname,'index.html');
const source=[...readFileSync(file,'utf8').matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
function app(input='',format='auto',fetcher=async()=>{throw Error('Unexpected network request')}){
 const nodes={in:{value:input},fmt:{value:format},out:{innerHTML:'',textContent:''},go:{},bar:{style:{},firstElementChild:{style:{}}}};
 const context=vm.createContext({TextEncoder,document:{getElementById:id=>nodes[id]},fetch:fetcher});vm.runInContext(source,context);return {nodes,context,run:()=>nodes.go.onclick()};
}
test('npm package map autodetection and pinned parsing',()=>{
 const a=app();const fixture=JSON.stringify({lockfileVersion:3,packages:{'node_modules/demo':{version:'1.2.3'}}});
 a.context.fixture=fixture;assert.equal(vm.runInContext('detect(fixture)',a.context),'npm');
 assert.equal(JSON.stringify(vm.runInContext("parse(fixture,'npm')",a.context)),JSON.stringify([['npm','demo','1.2.3']]));
});
test('empty npm file shows result without network',async()=>{const a=app('{"lockfileVersion":3,"packages":{}}');await a.run();assert.match(a.nodes.out.innerHTML,/Nothing resolvable/)});
test('malformed shapes never leave a rejected event handler',async()=>{
 for(const [text,format] of [['null','npm'],['{"packages":{}}','sbom'],['{"components":[null,7,{}]}','sbom'],['{"packages":[{"externalRefs":{}}]}','sbom'],['{"packages":[null]}','sbom']]){
  const a=app(text,format);await a.run();assert.ok(a.nodes.out.innerHTML||a.nodes.out.textContent);
 }
});
test('large input rejected before parse or lookup',async()=>{const a=app('x'.repeat(2*1024*1024+1));await a.run();assert.match(a.nodes.out.textContent,/2 MiB/)});
test('component and remote KEV metadata cannot inject markup into findings',async()=>{
 const injected='<img src=x onerror=alert(1)>';
 const fixture=JSON.stringify({bomFormat:'CycloneDX',components:[{purl:'pkg:npm/demo@1.2.3',name:injected,version:'1.2.3'}]});
 const a=app(fixture,'auto',async url=>({json:async()=>url==='/kev-mirror.json'?{cves:{'CVE-2026-1234':['','','',injected,false]},catalogVersion:injected,count:injected}:{results:[{vulns:[{id:'CVE-2026-1234'}]}]}}));
 await a.run();assert.match(a.nodes.out.innerHTML,/&lt;img/);assert.ok(!a.nodes.out.innerHTML.includes('<img'));assert.equal(a.nodes.go.disabled,false);
});
test('lookup errors render as escaped text and restore button',async()=>{const a=app('demo==1.2.3','auto',async()=>{throw Error('<svg onload=alert(1)>')});await a.run();assert.match(a.nodes.out.innerHTML,/&lt;svg/);assert.ok(!a.nodes.out.innerHTML.includes('<svg'));assert.equal(a.nodes.go.disabled,false)});
