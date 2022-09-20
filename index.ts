import SaxonJS from 'saxon-js';

const env = SaxonJS.getPlatform();

const doc = env.parseXmlFromString(env.readFile("./especificacao/lmht.xslt"));
// hack: avoid error "Required cardinality of value of parameter $static-base-uri is exactly one; supplied value is empty"
doc._saxonBaseUri = "file:///";

const sef = SaxonJS.compile(doc);

SaxonJS.transform({
    stylesheetInternal: sef,
    sourceFileName: "./especificacao/exemplo.lmht",
    destination: "serialized"
}, "async").then ((output: any) => {
    console.log(output.principalResult)
});
