
Batch Queue Support
===================


.. raw:: html

   <pre id="batch-submit-lsf" class="json batch-submit">
   <code>
   #!/bin/bash
   #BSUB -J <%= Slug.slugify(job.name) %>
   #BSUB -oo <%= Slug.slugify(job.name) + "-" + job.uuid %>.out
   #BSUB -e <%= Slug.slugify(job.name) + "-" + job.uuid %>.err
   #BSUB -W <%= roundToMinute(job.maxRunTime) %>
   #BSUB -q <%= job.batchQueue.mappedName %>
   #BSUB -L bash

   <% if (job.app.parallelism == ParallelismType.PTHREAD) { %>
     <%= "#BSUB -n " + job.nodeCount %>
     <%= "#BSUB -R 'span[ptile=1]'" %>
   <% } else if (job.app.parallelism == ParallelismType.SERIAL) { %>
     <%= "#BSUB -n " + job.nodeCount %>
     <%= "#BSUB -R 'span[ptile=1]'" %>
   <% } else { %>
     <%= "#BSUB -n " + (job.nodeCount * job.processorsPerNode) %>
     <%= "#BSUB -R 'span[ptile=" + job.processorsPerNode + "]'" %>
   <% } %>

   <%= "#BSUB " + job.batchQueue.customDirectives %>
   </code></pre>



.. raw:: html

   <pre id="batch-submit-pbs" class="json batch-submit">
   <code>
   #!/bin/bash
   #PBS -N <%= Slug.slugify(job.name) %>
   #PBS -o <%= Slug.slugify(job.name) + "-" + job.uuid %>.out
   #PBS -e <%= Slug.slugify(job.name) + "-" + job.uuid %>.err
   #PBS -l cput=<%= job.maxRunTime %>
   #PBS -l walltime=<%= job.maxRunTime %>
   #PBS -q <%= job.batchQueue.mappedName %>
   #PBS -l nodes=<%= job.nodeCount %>:ppn=<%= job.processorsPerNode %>

   <%= "#PBS " + job.batchQueue.customDirectives %>
   </code></pre>


**\ **\ **\ **\ ******\ **\ **\ **\ ** TODO **\ **\ **\ **\ **\ ******\ **\ **\ **\ **\ **


.. raw:: html

   <pre id="batch-submit-ll" class="json batch-submit">
   <code>
   #!/bin/bash
   #@ - <%= Slug.slugify(job.name) %>
   #@ environment = COPY_ALL
   #@ output = <%= Slug.slugify(job.name) + "-" + job.uuid %>.out
   #@ error = <%= Slug.slugify(job.name) + "-" + job.uuid %>.err
   #@ class = NORMAL
   #@ acct_no = NONE
   #@ wall_cock_limit = <%= job.maxRunTime %>

   <% if (job.app.parallelism == ParallelismType.PTHREAD) { %>
     #@ job_type = MPICH
     #@ nodes = 1
     #@ tasks_per_node = <%= job.processorsPerNode %>
   <% } else if (job.app.parallelism == ParallelismType.SERIAL) { %>
     #@ job_type = MPICH
     #@ nodes = 1
     #@ tasks_per_node = <%= job.processorsPerNode %>
   <% } else { %>
     <%= "#@ -n " + (job.nodeCount * job.processorsPerNode) %>
     <%= "#@ -R 'span[ptile=" + job.processorsPerNode + "]'" %>
   <% } %>

   <%= "#BSUB " + job.batchQueue.customDirectives %>
   </code></pre>


**\ **\ **\ **\ ******\ **\ **\ **\ ** TODO **\ **\ **\ **\ **\ ******\ **\ **\ **\ **\ **


.. raw:: html

   <pre id="batch-submit-torque" class="json batch-submit">
   <code>
   </code></pre>


**\ **\ **\ **\ ******\ **\ **\ **\ ** TODO **\ **\ **\ **\ **\ ******\ **\ **\ **\ **\ **


.. raw:: html

   <pre id="batch-submit-moab" class="json batch-submit">
   <code>
   </code></pre>



.. raw:: html

   <pre id="batch-submit-ge" class="json batch-submit">
   <code>
   #!/bin/bash
   #$ -N <%= Slug.slugify(job.name) %>
   #$ -cwd
   #$ -V
   #$ -o <%= Slug.slugify(job.name) + "-" + job.uuid %>.out
   #$ -e <%= Slug.slugify(job.name) + "-" + job.uuid %>.err
   #$ -l h_rt=<%= job.maxRunTime %>
   #$ -pe <%= job.nodeCount %> way <%= job.processorsPerNode %>
   #$ -q <%= job.batchQueue.mappedName %>

   <%= "#$ " + job.batchQueue.customDirectives %>
   </code></pre>



.. raw:: html

   <pre id="batch-submit-slurm" class="json batch-submit">
   <code>
   #!/bin/bash
   #SBATCH -J <%= Slug.slugify(job.name) %>
   #SBATCH -o <%= Slug.slugify(job.name) + "-" + job.uuid %>.out
   #SBATCH -e <%= Slug.slugify(job.name) + "-" + job.uuid %>.err
   #SBATCH -t <%= job.maxRunTime %>
   #SBATCH -q <%= job.batchQueue.mappedName %>
   #SBATCH -N <%= job.nodeCount %> -p <%= job.processorsPerNode %>

   <%= "#SBATCH " + job.batchQueue.customDirectives %>
   </code></pre>



.. raw:: html

   <pre id="batch-submit-condor" class="json batch-submit">
   <code>
   </code></pre>


.. code-block::

   I fixed the closing quote bug on the LSF scheduler and updated the directives to support all standard fields for Platform LSF >= 9.1.3. In case you struggle with parallelism, here is the template we use to assign tiling. It's a pretty straightforward interpretation of the serial vs threading vs MPI as defined in your app definition and job request:

   <p>
       <select id="queue-config-selector" name="queue-config-selector" onChange="$('.queue-config').addClass('hidden'); $('#' + $(this).val()).removeClass('hidden');">
           <option value="batch-submit-ge">GridEngine</option>
           <option value="batch-submit-condor">HTCondor</option>
           <option value="batch-submit-ll">LoadLeveler</option>
           <option value="batch-submit-lsf">LSF</option>
           <option value="batch-submit-torque">MOAB</option>
           <option value="batch-submit-pbs">PBS</option>
           <option value="batch-submit-slrum">Slurm</option>
           <option value="batch-submit-torque">Torque</option>
       </select>
   </p>



   If you would like to further customize the template to handle different networking, retry, or job array behavior, you can do so by using the _CUSTOM_LSF_  scheduler type on your system. You have the freedom to add any directives (remember to separate by "\n" newline characters ) you need to your systems's queues[].customDirectives field. They will be read at runtime, filtered of any wrapper template macros that you may want to fill out values dynamically based on the request, appended to the following minimal LSF template, and prepended to your wrapper template and submitted to your queue.

   {code}
   #!/bin/bash
   #BSUB -J <%= Slug.slugify(job.name) %>
   #BSUB -oo <%= Slug.slugify(job.name) + "-" + job.uuid %>.out
   #BSUB -e <%= Slug.slugify(job.name) + "-" + job.uuid %>.err
   {code}

   Notice that this alone won't be enough to get your job into queue, but it does maximize your flexibility. If you don't specify a customDirective value for one of your queues, the standard LSF template will be generated, so mix and match as you need.
