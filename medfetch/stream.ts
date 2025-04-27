import clarinet from "clarinet";

const startURL = "https://r4.smarthealthit.org/Patient";
const response = await fetch(startURL);
const reader = response.body!.getReader();
const decoder = new TextDecoder();

const parser = clarinet.parser();
let insideLinkArray = false;
let insideLinkObject = false;
let currentKey = "";
let currentLink: any = {};

parser.onkey = (key) => {
    currentKey = key;

    if (key === "link") {
        insideLinkArray = true;
    }
};

parser.onopenarray = () => {};

parser.onopenobject = () => {
    if (insideLinkArray) {
        insideLinkObject = true;
        currentLink = {};
    }
};

parser.onvalue = (value) => {
    if (insideLinkArray && insideLinkObject) {
        currentLink[currentKey] = value;
    }
};

parser.oncloseobject = () => {
    if (insideLinkArray && insideLinkObject) {
        insideLinkObject = false;
        console.log("Completed link object:", currentLink);
    }
};

parser.onclosearray = () => {
    if (insideLinkArray) {
        insideLinkArray = false;
        console.log("Done parsing link array");
    }
};

while (true) {
    const { value, done } = await reader.read();
    if (done || !value) {
        break;
    }

    const chunk = decoder.decode(value, { stream: true });

    parser.write(chunk);
}

