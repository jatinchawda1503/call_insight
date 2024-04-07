<div class="py-4">
    <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <!-- Chart Call Vols -->
        <div class="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:bg-gray-800 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div class="p-2">
                <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-black dark:text-white">Call Volumes</h2>
                <!-- Filter controls -->
                <div class="mt-6 flex justify-between items-center">
                    <div class="flex items-center">
                        <label for="yearFilter" class="block text-sm font-light text-gray-700 dark:text-white">Year:</label>
                        <select id="yearFilter" name="yearFilter" class="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border-none focus:outline-none focus:ring-0">
                            <!-- Year options will be populated dynamically -->
                        </select>
                    </div>
                    <div class="flex items-center">
                        <label for="monthFilter" class="block text-sm font-light text-gray-700 dark:text-white">Month:</label>
                        <select id="monthFilter" name="monthFilter" class="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border-none focus:outline-none focus:ring-0">
                            <!-- Month options will be populated dynamically -->
                        </select>
                    </div>
                    <div class="flex items-center">
                        <label for="dayFilter" class="block text-sm font-light text-gray-700 dark:text-white">Day:</label>
                        <select id="dayFilter" name="dayFilter" class="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border-none focus:outline-none focus:ring-0">
                            <!-- Day options will be populated dynamically -->
                        </select>
                    </div>
                </div>
                </div>
                <div id="callVols" class='p-4'></div>
            </div>
        </div>
        
        <!-- Chart Disposition  -->
        <div class="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:bg-gray-800 dark:border-strokedark dark:bg-boxdark xl:col-span-4">
            <div class="p-2">
                <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-black dark:text-white">Disposition</h2>
                </div>
                <div id="dispositionCount" class='p-4'></div>
            </div>
        </div>

        <!-- Top Caller/ Recipient Charts -->
        <div class="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:bg-gray-800 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
            <div class="p-2">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold text-black dark:text-white">Top Caller/ Recipient</h2>
                    <!-- Filter dropdown menu -->
                    <div class="flex items-center">
                        <!-- <label for="callerRecipientFilter" class="block text-sm font-light text-gray-700 dark:text-white">Filter:</label> -->
                        <select id="callerRecipientFilter" name="callerRecipientFilter" class="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none border-none focus:outline-none focus:ring-0">
                            <option value="Caller">Caller</option>
                            <option value="Recipient">Recipient</option>
                        </select>
                    </div> 
                </div>
                
                <div id="topCallersRecipients" class='p-4'></div>
                
            </div>
        </div>
        
        <!-- Chart Call Channels -->
        <div class="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:bg-gray-800 dark:border-strokedark dark:bg-boxdark xl:col-span-7">
            <div class="p-2">
                <h2 class="text-xl font-bold text-black dark:text-white">Call Channels</h2>
                <div id="callChannels" class='p-4'></div>
            </div>
        </div>
</div>

