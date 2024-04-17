class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, [this.engine.storyData.InitialLocation, [] ]); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(state) {
        let key = state[0]
        let items = state[1]
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData["Body"]); // TODO: replace this text by the Body of the location data
        
        if(("Choices" in locationData) && (locationData["Choices"].length > 0)) { // TODO: check if the location has any Choices

            for(let choice of locationData["Choices"]) { // TODO: loop over the location's Choices

                /*
                this.engine.show("debug - choice: " + JSON.stringify(choice, null, 4));
                this.engine.show("debug - prop: " + choice.hasOwnProperty('RequiresNot'));
                if(choice.hasOwnProperty('RequiresNot')) {
                    this.engine.show("debug - r-not: \'" + choice["RequiresNot"] + "\'");
                    this.engine.show("debug - in items: " + items.includes(choice["RequiresNot"]));
                }
                */

                if(choice.hasOwnProperty('Requires'))
                {
                    if(items.includes(choice.Requires))
                    {
                        if(choice.hasOwnProperty('RequiresNot') && items.includes(choice.RequiresNot))
                        {
                            continue;
                        }
                        this.engine.addChoice(choice["Text"], [choice, items]);
                    }
                    continue;
                }

                else if(choice.hasOwnProperty('RequiresNot') && items.includes(choice.RequiresNot))
                {
                    continue;
                }

                else
                {
                    this.engine.addChoice(choice["Text"], [choice, items]); // TODO: use the Text of the choice
                }
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            let target = choice[0]
            let state = choice[1]
            if(target.hasOwnProperty('addItem')) 
            {
                state.push(target.addItem)
            }
            this.engine.show("&gt; "+target.Text);

            this.engine.gotoScene(Location, [target.Target, state]);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'uniqueStory.json');