import { useState } from "react";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";
import { Serializer, settings } from "survey-core";
import { registerMyQuestion } from "./MyQuestion";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

//https://surveyjs.io/survey-creator/examples/editor-custom-theme-css-vars/reactjs#content-code

registerMyQuestion();

export default function SurveyCreatorWidget(props) {
  let [creator, setCreator] = useState();

  // Define what toolbox options should be available
  const creatorOptions = {
    questionTypes: ["text", "checkbox", "radiogroup", "dropdown", 'calendar'],
    showJSONEditorTab: true,
  };

  // If creator is undefined
  if (creator === undefined) {
    let options = { showTranslationTab: true };
    creator = new SurveyCreator(creatorOptions);

    creator.saveSurveyFunc = (no, callback) => {
      console.log("saved", JSON.stringify(creator.JSON));
      callback(no, true);
    };

    setCreator(creator);
  }

  // Hide those toolbox items that, for some reason were
  // not hidden by creatorOptions
  creator.toolbox.getItemByName("tagbox").visible = false;
  creator.toolbox.getItemByName("barrating").visible = false;
  creator.toolbox.getItemByName("bootstrapslider").visible = false;
  creator.toolbox.getItemByName("sortablelist").visible = false;
  creator.toolbox.getItemByName("nouislider").visible = false;

  // Group toolbox items into expendable categories - not needed now
  //   creator.toolbox.changeCategories([
  //     { name: "panel", category: "Panels" },
  // ]);

  // Disable the compact display mode
  // creator.toolbox.forceCompact = false;

  // settings.allowShowEmptyTitleInDesignMode = false; // ??

  // Hide adorners for every allowed toolbox option
  for (const toolBoxOptionName of creatorOptions.questionTypes) {
    creator.onElementAllowOperations.add(function (_, options) {
      if (options.obj?.getType() === toolBoxOptionName) {
        options.allowChangeType = false;
      }
    });
  }

  // change text language for toolbox labels
  creator.toolbox.getItemByName("text").title = "Text";
  creator.toolbox.getItemByName("checkbox").title = "Bifare opțiuni multiple";
  creator.toolbox.getItemByName("radiogroup").title = "Alegere opțiune";
  creator.toolbox.getItemByName("dropdown").title = "Input expandabil";
  creator.toolbox.getItemByName("datepicker").title = "Calendar";

  // try
  const newDefaultChoices = [
    {
      text: "Option 1",
      value: 1,
    },
    {
      text: "Option 2",
      value: 2,
    },
    {
      text: "Option 3",
      value: 3,
    },
  ];
  // Apply the default choices to the Checkbox, Radiogroup, and Dropdown question types
  creator.toolbox.getItemByName("checkbox").json.choices = newDefaultChoices;
  creator.toolbox.getItemByName("radiogroup").json.choices = newDefaultChoices;
  creator.toolbox.getItemByName("dropdown").json.choices = newDefaultChoices;

  // Hide it for now
  creator.JSON = props.json;

  return (
    <div>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
