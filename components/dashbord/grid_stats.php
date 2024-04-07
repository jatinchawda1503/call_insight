<div class="py-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div class="flex flex-col items-start justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md gap-4">
            <h2 class="text-xl font-bold text-black dark:text-white" >Total Calls</h2>
            <p class="text-sm font-medium" id="totalCalls"></p>
        </div>
        <div class="flex flex-col items-start justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md gap-4">
            <h2 class="text-xl font-bold">Call Durations</h2>
            <div class="flex flex-col gap-1.5">
            <p class="text-sm text-black dark:text-white" ><span>Avg Call Duration:</span><span id="averageCallDuration" class="font-bold ml-1"></span></p>
            <p class="text-sm text-black dark:text-white"><span>Min Call Duration:</span><span  id="minCallDuration" class="font-bold ml-1"></span></p>
            <p class="text-sm  text-black dark:text-white"><span>Max Call Duration:</span><span  id="maxCallDuration" class="font-bold ml-1"></span></p>
            </div>
        </div>
        <div class="flex flex-col items-start justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md gap-4">
            <h2 class="text-xl font-bold">Disposition Count</h2>
            <div class="flex flex-col gap-1.5">
                <p class="text-sm text-black dark:text-white" ><span>ANSWERED:</span><span id="dispositionAnswered" class="font-bold ml-1"></span></p>
                <p class="text-sm text-black dark:text-white"><span>NO ANSWER:</span><span  id="dispositionNotAnswered" class="font-bold ml-1"></span></p>
                <p class="text-sm  text-black dark:text-white"><span>FAILED:</span><span  id="dispositionFailed" class="font-bold ml-1"></span></p>
            </div>
        </div>
        <div class="flex flex-col items-start justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md gap-4">
            <h2 class="text-xl font-bold">Channel Calls</h2>
            <div class="flex flex-col gap-1.5">
                <p class="text-sm text-black dark:text-white" ><span>SIP:</span><span id="channelSIP" class="font-bold ml-1"></span></p>
                <p class="text-sm text-black dark:text-white"><span>LOCAL:</span><span  id="channelLOCAL" class="font-bold ml-1"></span></p>
            </div>
        </div>
    </div>
</div>