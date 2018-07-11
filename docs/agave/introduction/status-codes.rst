.. role:: raw-html-m2r(raw)
   :format: html


Status Codes
============

The API uses the following response status codes, as defined in the :raw-html-m2r:`<a href="https://www.ietf.org/rfc/rfc2616.txt" target="_blank">RFC 2616</a>` on successful and unsuccessful requests.

Success Codes
-------------


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Response Code</th>
       <th>Meaning</th>
       <th align="left">Description</th>
     </tr>
     <tr>
       <td>200</td>
       <td align="center">Success</td>
       <td>The request succeeded</td>
     <tr>
     </tr>
       <td>201</td>
       <td align="center">Created</td>
       <td>The request succeeded and a new resource was created. Only applicable on PUT and POST actions</td>
     <tr>
     </tr>
       <td>202</td>
       <td align="center">Accepted</td>
       <td>The request has been accepted for processing, but the processing has not been completed. Common for all async actions such as job submissions, file transfers, etc</td>
     <tr>
     </tr>
       <td>206</td>
       <td align="center">Partial Content</td>
       <td>The server has fulfilled the partial GET request for the resource. This will always be the return status of a request using a Range header</td>
     <tr>
     </tr>
       <td>301</td>
       <td align="center">Moved Permanently</td>
       <td>The requested resource has been assigned a new permanent URI. You should follow the Location header, repeating the request</td>
     <tr>
     </tr>
       <td>304</td>
       <td align="center">Not Modified</td>
       <td>You requested an action that succeeded, but did not modify the resource</td>
     </tr> 
   </table>


Error Codes
-----------


.. raw:: html

   <table style="width:100%" border="1px" cellpadding="5">
     <tr>
       <th align="left">Response Code</th>
       <th>Meaning</th>
       <th align="left">Description</th>
     </tr><tr>
       <td>400</td>
       <td align="center">Bad request</td>
       <td>Your request was invalid</td>
     <tr></tr>
       <td>401</td>
       <td align="center">Unauthorized</td>
       <td>Authentication required, but not provided</td>
     <tr></tr>
       <td>403</td>
       <td align="center">Forbidden</td>
       <td>You do not have permission to access the given resource</td>
     <tr></tr>
       <td>404</td>
       <td align="center">Not found</td>
       <td>No resource was found at the given URL</td>
     <tr></tr>
       <td>405</td>
       <td align="center">Method Not Allowed</td>
       <td>You tried to access a resource with an invalid method </td>
     <tr>
     </tr>
       <td>406</td>
       <td align="center">Not Acceptable</td>
       <td>You requested a response format that isn’t supported</td>
     </tr> 
   </table>

