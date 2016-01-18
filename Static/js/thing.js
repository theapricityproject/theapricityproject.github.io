var rand = Math.random;

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Array.prototype.random = function () {
    return this[randInt(0, this.length - 1)];
}

var network;
var allNodes;
var highlightActive = false;

nodes = [];

// create connections between people
// value corresponds with the amount of contact between two people
edges = [];

var nodesDataset = new vis.DataSet(nodes); // these come from vis.js
var edgesDataset = new vis.DataSet(edges);

function redrawAll() {
    var container = document.getElementById('mynetwork');
    var options = {
        nodes: {
            borderWidth: 10,
            size: 30,
            color: {
                border: '#ffffff',
                background: '#666666'
            },
            font: {
                color: 'white'
            }
        },
        physics: {
            barnesHut: {
                gravitationalConstant: -20000,
                centralGravity: 0.3,
                springLength: 100,
                // springConstant: 0.04,
                damping: 0.15,
                avoidOverlap: 1
            },
            maxVelocity: 10.0
        },
        edges: {
            smooth: {
                enabled: false
            },
            color: 'rgba(255, 255, 255, .75)',
            width: 5
        },
        interaction: {
            tooltipDelay: 100,
            hover: true,
            dragNodes: false,
            zoomView: false,
            dragView: false
        }
    };
    var data = {
        nodes: nodesDataset,
        edges: edgesDataset
    } // Note: data is coming from ./datasources/vis.js



    network = new vis.Network(container, data, options);

    // get a JSON object
    allNodes = nodesDataset.get({
        returnType: "Object"
    });

    //acts embedded for performance
    var s =
        "Give a sincere compliment to someone you don’t know.Start a conversation with someone you don’t know.Surprise your family, spouse, or roommate with breakfast.Pick up litter as you walk.Tell someone how much they mean to you.Contact someone you haven’t in a while.Let a car in while driving.Give up your seat on the bus or train.Tell someone you notice they're doing a good job.Treat your friends to dinner tonight at a restaurant you’ve never been to.Read a story to a child.Teach someone how to do something new.Donate to a charity.Do someone else's chores.Compliment a competitor.Bring in a treat to your workplace.Stand up for someone.Share something of yours with someone.Set up a blind date.Recommend your favourite song, book, or movie to a friend.Be happy for someone.Brag about someone for them.Inspire someone.Clean out your closet and donate clothes.Buy a coffee for someone.Write a genuine comment on someone’s social media post that you don’t usually talk to.Help someone unload their groceries.Refill someone's meter.Leave a book you find interesting in a public place.Call someone you usually ask for help from to just say thank you.Donate flowers to a nursing home.Clean up a local park.Donate a past toy to a child. Start a conversation with a homeless person.Send an anonymous letter to a senior.Give someone a hug.Take time to really listen to someone.Make someone new feel welcome.Help someone who’s lost.Allow someone to pass you in line.Let them keep the change.Buy snacks for your peers or colleagues.Buy an unexpected gift for someone, big or small.Pay for someone in line behind you.Offer to babysit.Treat a loved one to breakfast in bed.Donate to a blood drive.Organize a fundraising event.Offer to mow, shovel, or rake a neighbour's yard.Pick up and return something that was dropped.Return and item to someone you know from the Lost and Found.Give someone your parking space.Enable 'Amazon Smile' on your Amazon account.Invite someone to dinner.Write a letter to someone in need with 'More Love Letters'.";

    var acts = s.split(".");
    var MaxNodeCount = 50;

    //var acts = ["a", "b", "c"];


    //var imgs = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"];
    var connectivity = 1;
    var density = .75;
    network.moveTo({
        scale: .75
    });
    setInterval(function () {
        var id;

        if (nodesDataset.length < MaxNodeCount) {
            id = nodesDataset.length;

            //more sophisticated algorithm introduced latency of low-spec machines
            /*} else {
                id = randInt(0, MaxNodeCount - 1);
            }
        
            if (rand() < density || nodesDataset.length < MaxNodeCount){

                
                edgesDataset.remove(edgesDataset.get({
                    filter: function(item) {
                        return (item.from == id || item.to == id);
                    }
                }));
                
                nodesDataset.remove(id);*/

            //add script tag 


            /*$.getJSON("http://uifaces.com/api/v1/random", function(data){
                nodesDataset.add({
                    id:id,
                    shape: 'circularImage',
                    image: data.image_urls.normal,
                    title: "@"+data.username + " completed '" + acts.random() + "'. "
                    });
            });
            */
            /*nodesDataset.add({
                id: id,
                shape: 'circularImage',//+ encodeURIcomponent( "prosa100@gmail.com " ) ) ),//
                image: "http://www.gravatar.com/avatar/" +id+"?d=retro",
                //image: DIR + imgs.random(),
                title: acts.random()
                }
            );*/
            //select a cached user contribution from the db
            var USER_RANGE = 1000;
            var userID = randInt(1, USER_RANGE);
            nodesDataset.add({
                id: id,
                shape: 'circularImage', //+ encodeURIcomponent( "@gmail.com" ) ) ),//
                image: "https://avatars1.githubusercontent.com/u/" + userID + "?v=3&s=400",
                //image: DIR + imgs.random(),
                title: "I completed '" + acts[userID % acts.length] + ".'"
            });

        }
        if (rand() < connectivity && nodesDataset.length > 0) {
            var r = randInt(0, nodesDataset.length - 2);
            if (r >= id)
                r++;

            edgesDataset.add({
                from: r,
                to: id
            });
        }

    }, 2000);

    //execute in set interval
}

redrawAll()