var Application = function () 
{
	this.times = [];
	this.currentTimeIndex = -1;
	this.totalTimes = [];
	this.totalClientTimes = [];
	this.totalLast7Days = 0;
	this.workStoppedSymbol = "-";
	this.roundToMinutes = 30;
	this.is24HourClock = false;

	this.init = function ()
	{
		var self = this;

		self.loadData();
		self.setupEventHandling();
	};

	this.loadData = function ()
	{
		var self = this,
			time = null,
			previousTime = null,
			timesList = "",
			timeStampString = "";

		if("undefined" !== typeof localStorage.times && null !== localStorage.times)
		{
			self.times = JSON.parse(localStorage.times);
		}

		for(var i = 0, timesLength = self.times.length; i < timesLength; i++)
		{
			time = self.times[i];

			if(typeof time.id === "undefined")
			{
				time.id = i;
			}
			time.TimeStamp = new Date(time.TimeStamp);
			timeStampString = get12HourTime(time.TimeStamp);

			if(previousTime === null)
			{
				previousTime = time;
			}

			if(previousTime.TimeStamp.getDate() !== time.TimeStamp.getDate())
			{
				timesList += "<li class='timestamp-date-separator'><span class='datestamp'>" + (time.TimeStamp.getMonth() + 1) + "/" + time.TimeStamp.getDate() + "/" + time.TimeStamp.getFullYear() + "</span></li>";
			}

			timesList += "<li data-id='" + time.id + "'><span class='timestamp'>" + timeStampString + "</span><span class='name'>" + time.Name + "</span></li>";

			previousTime = time;
		}

		$("div.left-pane").find("ul").append($(timesList));

		self.updateTotals();
	};	

	var get12HourTime = function (dateTime)
	{
		var hours = dateTime.getHours(),
			isAm = true;
		
		if (hours > 12) {
    		hours -= 12;
    		isAm = false;
		} else if (hours === 0) {
   			hours = 12;
   			isAm = false;
		}

		return (hours + ":" + ("0" + dateTime.getMinutes()).slice(-2) + " " + (isAm === true ? "AM" : "PM"));
	};

	this.setupEventHandling = function ()
	{
		var self = this;

		$("div.input").find("button").off("click");

		$("div.input").find("button").on("click", function () 
		{
			if($.trim($("div.input").find("div").eq(0).text()) !== "")
			{
				var needsSeparator = false;

				self.currentTimeIndex = -1;

				var newId = (self.times.length === 0 ? 0 : self.times[self.times.length - 1].id + 1),
					time = {
						"Name": $.trim($("div.input").find("div").eq(0).text()),
						"TimeStamp": new Date(),
						"id": newId
					};

				if(self.times.length > 0 && time.TimeStamp.getDate() !== self.times[self.times.length - 1].TimeStamp.getDate())
				{
					needsSeparator = true;
				}

				self.times.push(time);

				timeStampString = get12HourTime(time.TimeStamp);

				if(needsSeparator === true)
				{
					$("div.left-pane").find("ul").append($("<li class='timestamp-date-separator'><span class='datestamp'>" + (time.TimeStamp.getMonth() + 1) + "/" + time.TimeStamp.getDate() + "/" + time.TimeStamp.getFullYear() + "</span></li>"));	
				}

				$("div.left-pane").find("ul").append($("<li data-id='" + time.id + "'><span class='timestamp'>" + timeStampString + "</span><span class='name'>" + time.Name + "</span></li>"));

				self.saveTimes();

				$("div.input").find("div").html("");

				self.calculateTotals();	

				$(".overflow").animate({ scrollTop: $('.overflow')[0].scrollHeight}, 1000);

				self.setupEventHandling();
			}
		});

		$("div.input").find("div").off("keyup");

		$("div.input").find("div").on("keyup", function (event)
		{
			if(event.keyCode === 13)
			{
				$("div.input").find("button").trigger("click");
			}
			else if(event.keyCode === 38)
			{
				if(self.currentTimeIndex === -1)
				{
					self.currentTimeIndex = self.times.length;
				}

				if(self.currentTimeIndex !== 0)
				{
					self.currentTimeIndex--;	
				}

				$(this).text(self.times[self.currentTimeIndex].Name);
			}
			else if(event.keyCode === 40)
			{
				if(self.currentTimeIndex === -1)
				{
					self.currentTimeIndex = self.times.length;
				}

				if(self.currentTimeIndex >= self.times.length - 1)
				{
					$(this).text("");
				}
				else
				{
					self.currentTimeIndex++;

					$(this).text(self.times[self.currentTimeIndex].Name);
				}
			}
		});

		$("li").find("span.timestamp").off("click");

		$("li").find("span.timestamp").on("click", function ()
		{
			$(this).hide();

			$(this).after($("<input type='text' class='timestamp' value='" + $(this).text() + "' />"));
			$(this).closest("li").find("input[type=text]").focus();

			self.setupEventHandling();
		});

		$("li").find("input[type=text].timestamp").off("blur");

		$("li").find("input[type=text].timestamp").on("blur", function ()
		{
			self.validateDateInput(this);
		});

		$("li").find("input[type=text].timestamp").off("keypress");

		$("li").find("input[type=text].timestamp").on("keypress", function (event)
		{
			if(event.keyCode === 13)
			{
				self.validateDateInput(this);	
			}
		});

		$("li").find("span.name").off("click");

		$("li").find("span.name").on("click", function ()
		{
			$(this).hide();

			$(this).after($("<input type='text' class='name' value='" + $(this).text() + "' />"));
			$(this).closest("li").find("input[type=text]").focus();

			self.setupEventHandling();
		});

		$("li").find("input[type=text].name").off("blur");

		$("li").find("input[type=text].name").on("blur", function ()
		{
			self.validateNameInput(this);
		});

		$("li").find("input[type=text].name").off("keypress");

		$("li").find("input[type=text].name").on("keypress", function (event)
		{
			if(event.keyCode === 13)
			{
				self.validateNameInput(this);	
			}
		});

		$("a.export-times-to-csv").off("click");

		$("a.export-times-to-csv").on("click", function ()
			{
				console.log(self.times);
				exportToCsv("times.csv", self.times);
			});

		$(".overflow").animate({ scrollTop: $('.overflow')[0].scrollHeight}, 1000);
	};

	this.validateNameInput = function (element)
	{
		var self = this;

		if($(element).val() === "")
		{
			console.log("nope, invalid name!");
		}
		else
		{
			self.updateName(+($(element).closest("li").data("id")), $(element).val());

			$(element).closest("li").find("span.name").text($(element).val());
			$(element).closest("li").find("span.name").show();
			$(element).remove();	
		}
	};

	this.validateDateInput = function (element)
	{
		var self = this;

		if($(element).val().indexOf(":") === -1 || (self.is24HourClock === false 
			&& $(element).val().toLowerCase().indexOf(" am") === -1
			&& $(element).val().toLowerCase().indexOf(" pm") === -1))
		{
			console.log("nope, invalid date!");
		}
		else
		{
			self.updateTime(+($(element).closest("li").data("id")), $(element).val());

			$(element).closest("li").find("span.timestamp").text($(element).val());
			$(element).closest("li").find("span.timestamp").show();
			$(element).remove();	
		}
	};

	this.updateName = function (id, newName)
	{
		var self = this,
			time = self.times[self.times.indexOfPropertyValue([
			{
				"prop": "id",
				"value": id
			}
		])];

		time.Name = newName;

		self.saveTimes();
	};

	this.updateTime = function (id, newTime)
	{
		var self = this,
			time = self.times[self.times.indexOfPropertyValue([
			{
				"prop": "id",
				"value": id
			}
		])];

		var newDateTime = new Date(time.TimeStamp),
			hours = +(newTime.split(":")[0]),
			minutes = +(newTime.split(":")[1].toLowerCase().replace(" pm", "").replace(" am", ""));

		if(newTime.toLowerCase().indexOf("pm") !== -1 && hours !== 12 && self.is24HourClock !== true)
		{
			hours += 12;
		}

		newDateTime = newDateTime.setHours(hours, minutes);

		time.TimeStamp = new Date(newDateTime);

		self.saveTimes();
	};

	this.saveTimes = function ()
	{
		var self = this;

		localStorage.times = JSON.stringify(self.times);

		self.updateTotals();
	};

	this.updateTotals = function ()
	{
		var self = this;

		self.calculateTotals();
		self.calculateTotalsByClient();
		self.displayTotals();
	};

	this.calculateTotals = function ()
	{
		var self = this,
			thisTime = null,
			nextTime = null,
			timeSpan = 0;

		self.totalTimes = [];
		self.totalLast7Days = 0

		for(var i = 0, timesLength = self.times.length; i < timesLength; i++)
		{
			thisTime = self.times[i];
			timeSpan = 0;
			nextTime = null;

			if(i < timesLength - 1)
			{
				nextTime = self.times[i+1];
			}

			if(nextTime !== null)
			{
				timeSpan = (nextTime.TimeStamp - thisTime.TimeStamp) / 1000 / 60 / 60;

				//timeSpan = timeSpan.toFixed(1);

				timeSpan = +(timeSpan);
			}

			var thisIndex = self.totalTimes.indexOfPropertyValue([
				{
					"prop": "Name", 
					"value": thisTime["Name"]
				},
				{
					"prop": "Date", 
					"value": (thisTime.TimeStamp.getMonth() + 1) + "/" + thisTime.TimeStamp.getDate() + "/" + thisTime.TimeStamp.getFullYear()
				}
			]);

			if(thisIndex === -1)
			{
				self.totalTimes.push({
					"Name": thisTime.Name,
					"Date": (thisTime.TimeStamp.getMonth() + 1) + "/" + thisTime.TimeStamp.getDate() + "/" + thisTime.TimeStamp.getFullYear(),
					"TimeSpan": timeSpan
				});
			}
			else if(nextTime !== null)
			{
				var totalTime = self.totalTimes[thisIndex];
				
				totalTime.TimeSpan = +(totalTime.TimeSpan) + timeSpan;
			}

		}
	};

	this.calculateTotalsByClient = function ()
	{
		var self = this,
			thisTotalTime,
			thisClient,
			clients = [],
			timeObject;

		self.totalClientTimes = [];

		for(var i = 0, totalTimesLength = self.totalTimes.length; i < totalTimesLength; i++)
		{
			thisTotalTime = self.totalTimes[i];
			thisClient = thisTotalTime.Name;

			if(thisClient.indexOf("-") !== -1)
			{
				thisClient = $.trim(thisClient.split("-")[0]);
			}

			timeObject = {
				"Date": thisTotalTime.Date,
				"TimeSpan": thisTotalTime.TimeSpan
			};

			if(clients.indexOf(thisClient) === -1
			   && thisClient !== "")
			{
				clients.push(thisClient);

				self.totalClientTimes.push({
					"Client": thisClient,
					"Times": [],
					"Days": []
				});

				self.totalClientTimes[self.totalClientTimes.length - 1].Times.push(timeObject);
			}
			else if(thisClient !== "")
			{
				self.totalClientTimes[self.totalClientTimes.indexOfPropertyValue([{
					"prop": "Client",
					"value": thisClient
				}])].Times.push(timeObject);
			}
		}

		var totalClient,
			totalClientTime,
			thisClientDate;

		for(var i = 0, totalClientsLength = self.totalClientTimes.length; i < totalClientsLength; i++)
		{
			totalClient = self.totalClientTimes[i];

			for(var j = 0, totalClientTimesLength = totalClient.Times.length; j < totalClientTimesLength; j++)
			{
				totalClientTime = totalClient.Times[j];

				if(self.roundToMinutes === 30)
				{
					totalClientTime.TimeSpanRaw = totalClientTime.TimeSpan;
					totalClientTime.TimeSpan = Math.round(totalClientTime.TimeSpan * 2) / 2;	
				}

				if(j === 0
				   || thisClientDate !== totalClientTime.Date)
				{
					thisClientDate = totalClientTime.Date;

					totalClient.Days.push(
					{
						"Day": thisClientDate,
						"TotalTime": totalClientTime.TimeSpan
					});
				}
				else if(thisClientDate === totalClientTime.Date)
				{
					totalClient.Days[totalClient.Days.indexOfPropertyValue([{
						prop: "Day",
						value: thisClientDate
					}])].TotalTime += +(totalClientTime.TimeSpan);
				}
			}
		}
	};

	this.displayTotals = function ()
	{
		var self = this,
			clientDayIndex,
			clientTotalTime,
			totalTimesList = "",
			totalTime = null
			today = new Date(),
			sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

		for(var i = 0, totalTimesLength = self.totalTimes.length; i < totalTimesLength; i++)
		{
			totalTime = self.totalTimes[i];

			if(self.roundToMinutes === 30)
			{
				totalTime.TimeSpanRaw = totalTime.TimeSpan;
				totalTime.TimeSpan = Math.round(totalTime.TimeSpan * 2) / 2;	
			}

			if(totalTime.Name !== "-")
			{	
				totalTimesList += "<li><span class='datestamp'>" + totalTime.Date + "</span> " + totalTime.Name + " - " + (totalTime.TimeSpan === null ? "In Progress" : totalTime.TimeSpan + (totalTime.TimeSpan === 1 ? " hour" : " hours")) + "</li>";
			}

			if((i > 0 && (new Date(self.totalTimes[i - 1].Date)).getDate() !== (new Date(totalTime.Date)).getDate()) 
				|| i === self.totalTimes.length - 1)
			{
				var newDate = new Date(totalTime.Date);

				for(var j = 0, totalClientTimesLength = self.totalClientTimes.length; j < totalClientTimesLength; j++)
				{
					clientTotalTime = self.totalClientTimes[j];
					clientDayIndex = clientTotalTime.Days.indexOfPropertyValue([{
							prop: "Day",
							value: self.totalTimes[i - 1].Date
						}]);
					
					if(clientDayIndex !== -1)
					{
						totalTimesList += "<li class='daily-total'><span>TOTAL - " + clientTotalTime.Client + " - " + (clientTotalTime.Days[clientDayIndex].TotalTime + (clientTotalTime.Days[clientDayIndex].TotalTime === 1 ? " hour" : " hours")) + "</span></li>";
					}
				}

				if(i !== self.totalTimes.length - 1)
				{
					totalTimesList += "<li class='timestamp-date-separator'><span class='datestamp'>" + (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear() + "</span></li>";	
				}
			}
		
			if(new Date(totalTime.Date) > sevenDaysAgo && totalTime.Name !== self.workStoppedSymbol && totalTime.Name !== "")
			{
				self.totalLast7Days += totalTime.TimeSpan;
			}
		}

		$(".last7Days").text(self.totalLast7Days);

		$("div.right-pane").find("ul").html("");
		$("div.right-pane").find("ul").append($(totalTimesList));

		console.log(self.totalClientTimes);
	};
}

var track = new Application();

track.init();